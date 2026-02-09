import os
import json
import re
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional
from datetime import datetime
import PyPDF2
from openai import OpenAI
from dotenv import load_dotenv
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from pymongo import MongoClient
from pymongo.errors import PyMongoError

# Load environment variables
load_dotenv()


# ============================================================================
# DATA STRUCTURES
# ============================================================================

@dataclass
class PDFSummary:
    """Structured summary output"""
    executive_summary: str = ""
    key_findings: List[str] = None
    financial_highlights: Dict[str, str] = None
    important_dates: List[str] = None
    risk_factors: List[str] = None
    recommendations: List[str] = None
    page_count: int = 0
    confidence_score: float = 0.0
    
    def __post_init__(self):
        if self.key_findings is None:
            self.key_findings = []
        if self.financial_highlights is None:
            self.financial_highlights = {}
        if self.important_dates is None:
            self.important_dates = []
        if self.risk_factors is None:
            self.risk_factors = []
        if self.recommendations is None:
            self.recommendations = []


# ============================================================================
# MONGODB MANAGER
# ============================================================================

class MongoDBManager:
    """Manage MongoDB operations for PDF summaries"""
    
    def __init__(self, mongodb_uri: str = None, database_name: str = None):
        self.mongodb_uri = mongodb_uri or os.getenv("MONGODB_URI", "mongodb+srv://Kowsalya:0kNsMDIYyidDLGTf@cluster0.0drq2p2.mongodb.net/scraper_db?retryWrites=true&w=majority")
        self.database_name = database_name or os.getenv("PDF_DATABASE_NAME", "pdf_summaries")
        self.client = None
        self.db = None
        self._connect()
    
    def _connect(self):
        """Connect to MongoDB"""
        try:
            print(f"\n📦 Connecting to MongoDB at {self.mongodb_uri}...")
            self.client = MongoClient(self.mongodb_uri, serverSelectionTimeoutMS=5000)
            self.client.server_info()  # Test connection
            self.db = self.client[self.database_name]
            
            # Create collections if they don't exist
            collections = ['pdf_summaries', 'pdf_metadata', 'analysis_logs']
            existing = self.db.list_collection_names()
            
            for coll in collections:
                if coll not in existing:
                    self.db.create_collection(coll)
            
            # Create indexes
            self.db.pdf_summaries.create_index([("document_name", 1)])
            self.db.pdf_summaries.create_index([("analysis_date", -1)])
            self.db.pdf_summaries.create_index([("confidence_score", -1)])
            
            print(f"✓ Connected to MongoDB database: {self.database_name}")
            
        except Exception as e:
            print(f"✗ MongoDB connection failed: {e}")
            raise
    
    def save_summary(self, summary: PDFSummary, document_name: str, pdf_path: str, 
                     output_json: str = None, output_pdf: str = None) -> str:
        """Save PDF summary to MongoDB"""
        try:
            print(f"\n💾 Saving summary to MongoDB...")
            
            # Prepare document
            summary_doc = {
                'document_name': document_name,
                'pdf_path': pdf_path,
                'analysis_date': datetime.now(),
                'page_count': summary.page_count,
                'confidence_score': summary.confidence_score,
                'executive_summary': summary.executive_summary,
                'key_findings': summary.key_findings,
                'financial_highlights': summary.financial_highlights,
                'important_dates': summary.important_dates,
                'risk_factors': summary.risk_factors,
                'recommendations': summary.recommendations,
                'output_files': {
                    'json_path': output_json,
                    'pdf_report_path': output_pdf
                },
                'metadata': {
                    'created_at': datetime.now(),
                    'file_size': os.path.getsize(pdf_path) if os.path.exists(pdf_path) else 0,
                    'processing_status': 'completed'
                }
            }
            
            # Insert or update
            result = self.db.pdf_summaries.update_one(
                {
                    'document_name': document_name,
                    'pdf_path': pdf_path
                },
                {'$set': summary_doc},
                upsert=True
            )
            
            if result.upserted_id:
                doc_id = str(result.upserted_id)
                print(f"✓ New summary saved with ID: {doc_id}")
            else:
                print(f"✓ Summary updated for document: {document_name}")
                doc_id = str(self.db.pdf_summaries.find_one({
                    'document_name': document_name,
                    'pdf_path': pdf_path
                })['_id'])
            
            # Save metadata separately
            self._save_metadata(document_name, summary, doc_id)
            
            # Log the analysis
            self._log_analysis(document_name, summary, 'success')
            
            return doc_id
            
        except Exception as e:
            print(f"✗ Error saving to MongoDB: {e}")
            self._log_analysis(document_name, None, 'failed', str(e))
            raise
    
    def _save_metadata(self, document_name: str, summary: PDFSummary, summary_id: str):
        """Save document metadata"""
        metadata_doc = {
            'summary_id': summary_id,
            'document_name': document_name,
            'analysis_date': datetime.now(),
            'statistics': {
                'key_findings_count': len(summary.key_findings),
                'financial_metrics_count': len(summary.financial_highlights),
                'important_dates_count': len(summary.important_dates),
                'risk_factors_count': len(summary.risk_factors),
                'recommendations_count': len(summary.recommendations),
                'confidence_score': summary.confidence_score
            }
        }
        
        self.db.pdf_metadata.insert_one(metadata_doc)
        print(f" Metadata saved")
    
    def _log_analysis(self, document_name: str, summary: PDFSummary = None, 
                     status: str = 'success', error: str = None):
        """Log analysis run"""
        log_doc = {
            'document_name': document_name,
            'timestamp': datetime.now(),
            'status': status,
            'confidence_score': summary.confidence_score if summary else 0.0,
            'page_count': summary.page_count if summary else 0,
            'error': error
        }
        
        self.db.analysis_logs.insert_one(log_doc)
    
    def get_summary_by_name(self, document_name: str) -> Dict:
        """Retrieve summary by document name"""
        return self.db.pdf_summaries.find_one({'document_name': document_name})
    
    def get_all_summaries(self, limit: int = 100) -> List[Dict]:
        """Get all summaries"""
        return list(self.db.pdf_summaries.find().sort('analysis_date', -1).limit(limit))
    
    def get_summaries_by_confidence(self, min_confidence: float = 0.8) -> List[Dict]:
        """Get summaries with high confidence"""
        return list(self.db.pdf_summaries.find({
            'confidence_score': {'$gte': min_confidence}
        }).sort('confidence_score', -1))
    
    def get_analysis_stats(self) -> Dict:
        """Get analysis statistics"""
        total = self.db.pdf_summaries.count_documents({})
        
        pipeline = [
            {
                '$group': {
                    '_id': None,
                    'avg_confidence': {'$avg': '$confidence_score'},
                    'avg_pages': {'$avg': '$page_count'},
                    'total_documents': {'$sum': 1}
                }
            }
        ]
        
        stats = list(self.db.pdf_summaries.aggregate(pipeline))
        
        return {
            'total_documents': total,
            'avg_confidence': stats[0]['avg_confidence'] if stats else 0,
            'avg_pages': stats[0]['avg_pages'] if stats else 0,
            'latest_analysis': self.db.pdf_summaries.find_one(
                sort=[('analysis_date', -1)]
            )
        }
    
    def delete_summary(self, document_name: str) -> bool:
        """Delete a summary"""
        result = self.db.pdf_summaries.delete_one({'document_name': document_name})
        if result.deleted_count > 0:
            print(f" Deleted summary: {document_name}")
            return True
        return False
    
    def close(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()
            print("MongoDB connection closed")


# ============================================================================
# PDF REPORT GENERATOR
# ============================================================================

class PDFReportGenerator:
    """Generate beautiful PDF reports from summaries"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Create custom styles for the report"""
        # Title style
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=26,
            textColor=colors.HexColor('#1e3a8a'),
            spaceAfter=30,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
        
        # Section header style
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading2'],
            fontSize=14,
            textColor=colors.white,
            spaceAfter=12,
            spaceBefore=20,
            fontName='Helvetica-Bold',
            borderWidth=0,
            borderPadding=10,
            backColor=colors.HexColor('#2563eb')
        ))
        
        # Body text style
        self.styles.add(ParagraphStyle(
            name='CustomBody',
            parent=self.styles['BodyText'],
            fontSize=11,
            textColor=colors.HexColor('#374151'),
            leading=16,
            alignment=TA_JUSTIFY,
            spaceAfter=12
        ))
        
        # Bullet point style
        self.styles.add(ParagraphStyle(
            name='CustomBullet',
            parent=self.styles['BodyText'],
            fontSize=10,
            textColor=colors.HexColor('#1f2937'),
            leading=14,
            leftIndent=20,
            spaceAfter=8
        ))
    
    def _calculate_column_widths(self, data: List[List[str]], available_width: float = 6.5) -> List[float]:
        """Calculate optimal column widths based on content length"""
        if not data:
            return [available_width / 2 * inch, available_width / 2 * inch]
        
        max_key_len = max(len(str(row[0])) for row in data)
        max_val_len = max(len(str(row[1])) for row in data)
        
        total_len = max_key_len + max_val_len
        
        if total_len == 0:
            return [available_width / 2 * inch, available_width / 2 * inch]
        
        key_width = (max_key_len / total_len) * available_width * inch
        val_width = (max_val_len / total_len) * available_width * inch
        
        min_width = 1.5 * inch
        key_width = max(key_width, min_width)
        val_width = max(val_width, min_width)
        
        total_width = key_width + val_width
        if total_width > available_width * inch:
            scale = (available_width * inch) / total_width
            key_width *= scale
            val_width *= scale
        
        return [key_width, val_width]
    
    def generate_pdf(self, summary: PDFSummary, original_filename: str, output_path: str):
        """Generate PDF report from summary"""
        print(f"\n📄 Generating PDF report: {output_path}")
        
        doc = SimpleDocTemplate(
            output_path,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        
        elements = []
        
        # Title Page
        elements.append(Spacer(1, 0.8*inch))
        
        accent_line = Table([['']], colWidths=[6*inch])
        accent_line.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#2563eb')),
            ('LINEABOVE', (0, 0), (-1, 0), 4, colors.HexColor('#1e3a8a')),
        ]))
        elements.append(accent_line)
        elements.append(Spacer(1, 0.3*inch))
        
        elements.append(Paragraph("DOCUMENT ANALYSIS REPORT", self.styles['CustomTitle']))
        elements.append(Spacer(1, 0.1*inch))
        
        subtitle_style = ParagraphStyle(
            name='Subtitle',
            parent=self.styles['Normal'],
            fontSize=12,
            textColor=colors.HexColor('#6b7280'),
            alignment=TA_CENTER,
            spaceAfter=20
        )
        elements.append(Paragraph("AI-Powered Investment Banking Analysis", subtitle_style))
        elements.append(Spacer(1, 0.3*inch))
        
        info_data = [
            ['Source Document:', original_filename],
            ['Total Pages:', str(summary.page_count)],
            ['Analysis Date:', datetime.now().strftime('%B %d, %Y')],
            ['Confidence Score:', f"{summary.confidence_score:.0%}"],
        ]
        
        info_table = Table(info_data, colWidths=[2*inch, 4*inch])
        info_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#dbeafe')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#1e3a8a')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#93c5fd'))
        ]))
        
        elements.append(info_table)
        elements.append(PageBreak())
        
        # Executive Summary
        if summary.executive_summary:
            elements.append(Paragraph("EXECUTIVE SUMMARY", self.styles['SectionHeader']))
            elements.append(Spacer(1, 0.2*inch))
            
            paragraphs = summary.executive_summary.split('\n\n')
            for para in paragraphs:
                if para.strip():
                    elements.append(Paragraph(para.strip(), self.styles['CustomBody']))
            
            elements.append(Spacer(1, 0.3*inch))
        
        # Key Findings
        if summary.key_findings:
            elements.append(Paragraph("KEY FINDINGS", self.styles['SectionHeader']))
            elements.append(Spacer(1, 0.1*inch))
            
            for i, finding in enumerate(summary.key_findings, 1):
                bullet_text = f"<b>{i}.</b> {finding}"
                elements.append(Paragraph(bullet_text, self.styles['CustomBullet']))
            
            elements.append(Spacer(1, 0.3*inch))
        
        # Financial Highlights
        if summary.financial_highlights:
            elements.append(Paragraph("FINANCIAL HIGHLIGHTS", self.styles['SectionHeader']))
            elements.append(Spacer(1, 0.1*inch))
            
            financial_data = [[k, v] for k, v in summary.financial_highlights.items()]
            
            if financial_data:
                col_widths = self._calculate_column_widths(financial_data)
                
                fin_table = Table(financial_data, colWidths=col_widths)
                fin_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#059669')),
                    ('TEXTCOLOR', (0, 0), (0, -1), colors.white),
                    ('TEXTCOLOR', (1, 0), (1, -1), colors.HexColor('#1f2937')),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 10),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
                    ('TOPPADDING', (0, 0), (-1, -1), 10),
                    ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#10b981')),
                    ('ROWBACKGROUNDS', (1, 0), (1, -1), [colors.white, colors.HexColor('#d1fae5')]),
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ]))
                elements.append(fin_table)
            
            elements.append(Spacer(1, 0.3*inch))
        
        # Important Dates
        if summary.important_dates:
            elements.append(Paragraph("IMPORTANT DATES", self.styles['SectionHeader']))
            elements.append(Spacer(1, 0.1*inch))
            
            for date in summary.important_dates:
                elements.append(Paragraph(f"• {date}", self.styles['CustomBullet']))
            
            elements.append(Spacer(1, 0.3*inch))
        
        # Risk Factors
        if summary.risk_factors:
            elements.append(Paragraph("RISK FACTORS", self.styles['SectionHeader']))
            elements.append(Spacer(1, 0.1*inch))
            
            for i, risk in enumerate(summary.risk_factors, 1):
                risk_text = f"<b>{i}.</b> {risk}"
                elements.append(Paragraph(risk_text, self.styles['CustomBullet']))
            
            elements.append(Spacer(1, 0.3*inch))
        
        # Recommendations
        if summary.recommendations:
            elements.append(Paragraph("RECOMMENDATIONS", self.styles['SectionHeader']))
            elements.append(Spacer(1, 0.1*inch))
            
            for i, rec in enumerate(summary.recommendations, 1):
                rec_text = f"<b>{i}.</b> {rec}"
                elements.append(Paragraph(rec_text, self.styles['CustomBullet']))
        
        # Footer
        elements.append(Spacer(1, 0.5*inch))
        footer_text = f"<i>Report generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</i>"
        elements.append(Paragraph(footer_text, self.styles['Normal']))
        
        try:
            doc.build(elements)
            print(f"PDF report generated successfully!")
            return True
        except Exception as e:
            print(f"Error generating PDF: {e}")
            return False


# ============================================================================
# PDF SUMMARIZER WITH OPENAI
# ============================================================================

class PDFSummarizer:
    """Main PDF Summarizer using OpenAI"""
    
    def __init__(self, api_key: str = None, use_mongodb: bool = True):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables!")
        
        self.client = OpenAI(api_key=self.api_key)
        print("OpenAI client initialized")
        
        # MongoDB integration
        self.use_mongodb = use_mongodb
        self.mongo_manager = None
        if use_mongodb:
            try:
                self.mongo_manager = MongoDBManager()
            except Exception as e:
                print(f"MongoDB not available: {e}")
                self.use_mongodb = False
    
    def extract_text_from_pdf(self, pdf_path: str) -> tuple:
        """Extract all text from PDF"""
        print(f"\nReading PDF: {pdf_path}")
        
        try:
            with open(pdf_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                page_count = len(reader.pages)
                
                print(f"   Total pages: {page_count}")
                
                all_text = []
                for i, page in enumerate(reader.pages, 1):
                    text = page.extract_text()
                    all_text.append(f"\n--- PAGE {i} ---\n{text}")
                    
                    if i % 10 == 0:
                        print(f"   Processed {i}/{page_count} pages...")
                
                full_text = "\n".join(all_text)
                print(f" Extracted {len(full_text):,} characters\n")
                
                return full_text, page_count
                
        except FileNotFoundError:
            print(f" Error: File '{pdf_path}' not found!")
            raise
        except Exception as e:
            print(f" Error reading PDF: {e}")
            raise
    
    def chunk_text(self, text: str, max_tokens: int = 120000) -> List[str]:
        """Split text into chunks"""
        max_chars = max_tokens * 4
        
        if len(text) <= max_chars:
            return [text]
        
        chunks = []
        current_chunk = ""
        
        for section in text.split("\n--- PAGE"):
            if len(current_chunk) + len(section) < max_chars:
                current_chunk += "\n--- PAGE" + section
            else:
                if current_chunk:
                    chunks.append(current_chunk)
                current_chunk = "\n--- PAGE" + section
        
        if current_chunk:
            chunks.append(current_chunk)
        
        print(f"   Split into {len(chunks)} chunks for processing")
        return chunks
    
    def summarize_chunk(self, text: str, chunk_num: int, total_chunks: int) -> str:
        """Summarize a single chunk"""
        print(f"   Analyzing chunk {chunk_num}/{total_chunks}...")
        
        prompt = f"""You are analyzing part {chunk_num} of {total_chunks} of a document.

Extract and summarize key information in JSON format:

Document text:
{text[:100000]}

Respond in JSON:
{{
    "key_points": ["point 1 (page X)", "point 2 (page Y)", ...],
    "financial_data": {{"metric": "value (page X)", ...}},
    "dates": ["date 1 (page X)", ...],
    "risks": ["risk 1 (page X)", ...],
    "entities": ["name 1", "name 2", ...]
}}

Only include explicitly stated information with page references."""

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a precise document analyst. Extract only factual information with page references."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                max_tokens=4096
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"   Error in chunk {chunk_num}: {e}")
            return "{}"
    
    def create_final_summary(self, chunk_summaries: List[str], page_count: int) -> PDFSummary:
        """Combine chunk summaries"""
        print(f"\nCreating final summary from {len(chunk_summaries)} chunks...")
        
        combined = "\n\n".join([f"=== Chunk {i+1} ===\n{s}" for i, s in enumerate(chunk_summaries)])
        
        prompt = f"""Create a comprehensive executive summary from this {page_count}-page document analysis.

All extracted data:
{combined}

Create JSON response:
{{
    "executive_summary": "Clear 3-5 paragraph summary",
    "key_findings": ["Finding 1 (page X)", "Finding 2 (page Y)", ...],
    "financial_highlights": {{"Revenue": "value (page X)", ...}},
    "important_dates": ["Date 1 (page X)", ...],
    "risk_factors": ["Risk 1 (page X)", ...],
    "recommendations": ["Recommendation 1", ...]
}}

Include page references for all data points."""

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "Create comprehensive executive summary. Be thorough but concise."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2,
                max_tokens=4096
            )
            
            return self._parse_summary(response.choices[0].message.content, page_count)
            
        except Exception as e:
            print(f"✗ Error creating summary: {e}")
            return PDFSummary(executive_summary="Error creating summary", page_count=page_count)
    
    def verify_summary(self, original_text: str, summary: PDFSummary) -> float:
        """Verify summary accuracy"""
        print("\nVerifying summary accuracy...")
        
        sample_text = original_text[:50000]
        
        prompt = f"""Verify if this summary accurately represents the source.

SOURCE (sample):
{sample_text}

SUMMARY:
{summary.executive_summary}

Key Findings: {json.dumps(summary.key_findings)}

JSON response:
{{
    "confidence_score": 0.0-1.0,
    "issues_found": ["issue 1", ...] or []
}}"""

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "Strict fact-checker. Flag inaccuracies."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0,
                max_tokens=1024
            )
            
            result = json.loads(re.search(r'\{.*\}', response.choices[0].message.content, re.DOTALL).group())
            confidence = result.get("confidence_score", 0.5)
            issues = result.get("issues_found", [])
            
            if issues:
                print(f"  Issues found: {len(issues)}")
                for issue in issues:
                    print(f"      - {issue}")
            else:
                print(f"    No issues found")
            
            print(f"   Confidence Score: {confidence:.0%}")
            return confidence
            
        except Exception as e:
            print(f"   Verification error: {e}")
            return 0.5
    
    def _parse_summary(self, response_text: str, page_count: int) -> PDFSummary:
        """Parse JSON response"""
        try:
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group())
            else:
                data = json.loads(response_text)
            
            return PDFSummary(
                executive_summary=data.get("executive_summary", ""),
                key_findings=data.get("key_findings", []),
                financial_highlights=data.get("financial_highlights", {}),
                important_dates=data.get("important_dates", []),
                risk_factors=data.get("risk_factors", []),
                recommendations=data.get("recommendations", []),
                page_count=page_count
            )
        except Exception as e:
            print(f"  Parse error: {e}")
            return PDFSummary(executive_summary=response_text, page_count=page_count)
    
    def summarize_pdf(self, pdf_path: str, save_files: bool = True) -> PDFSummary:
        """Main method: Summarize entire PDF"""
        print("\n" + "="*70)
        print("PDF SUMMARIZATION SYSTEM (Powered by OpenAI + MongoDB)")
        print("="*70)
        
        full_text, page_count = self.extract_text_from_pdf(pdf_path)
        chunks = self.chunk_text(full_text)
        
        chunk_summaries = []
        for i, chunk in enumerate(chunks, 1):
            summary = self.summarize_chunk(chunk, i, len(chunks))
            chunk_summaries.append(summary)
        
        final_summary = self.create_final_summary(chunk_summaries, page_count)
        confidence = self.verify_summary(full_text, final_summary)
        final_summary.confidence_score = confidence
        
        # Save to MongoDB
        if self.use_mongodb and self.mongo_manager:
            try:
                document_name = os.path.basename(pdf_path)
                doc_id = self.mongo_manager.save_summary(
                    summary=final_summary,
                    document_name=document_name,
                    pdf_path=pdf_path,
                    output_json=None,  # Will be set later
                    output_pdf=None    # Will be set later
                )
                print(f" Saved to MongoDB with ID: {doc_id}")

                # Optionally save JSON and PDF report
            
                
            except Exception as e:
                print(f"Error saving summary to MongoDB: {e}")

        print("\nPDF summarization completed.")
        return final_summary

from openai import OpenAI
import PyPDF2
import json

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def extract_text_from_pdf(pdf_path):
    text = ""
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text += page.extract_text() or ""
    return text[:15000]  

def summarize_text_with_ai(text):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a financial analyst who summarizes investment reports."},
            {"role": "user", "content": f"Summarize the following PDF text into key insights and a professional summary:\n\n{text}"}
        ],
        temperature=0.3,
    )
    return response.choices[0].message.content.strip()

def summarize_pdf(pdf_path):
    text = extract_text_from_pdf(pdf_path)
    summary = summarize_text_with_ai(text)
    return {
        "executive_summary": summary,
        "details": {
            "page_count": 10, 
            "key_findings": ["AI-generated summary completed."]
        }
    }

if __name__ == "__main__":
    import sys
    pdf_path = sys.argv[1]
    result = summarize_pdf(pdf_path)
    print(json.dumps(result))


