import os
import json
import re
import sys
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY

# ============================================================================
# DATA STRUCTURE
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
# PDF REPORT GENERATOR
# ============================================================================
class PDFReportGenerator:
    """Generate beautiful PDF reports from summaries"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=26,
            textColor=colors.HexColor('#1e3a8a'),
            spaceAfter=30,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
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
        self.styles.add(ParagraphStyle(
            name='CustomBody',
            parent=self.styles['BodyText'],
            fontSize=11,
            textColor=colors.HexColor('#374151'),
            leading=16,
            alignment=TA_JUSTIFY,
            spaceAfter=12
        ))
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
        if not data:
            return [available_width / 2 * inch, available_width / 2 * inch]
        
        try:
            max_key_len = max(len(str(row[0])) for row in data)
            max_val_len = max(len(str(row[1])) for row in data)
        except:
            return [available_width / 2 * inch, available_width / 2 * inch]
            
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
        doc = SimpleDocTemplate(
            output_path,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        
        elements = []
        
        elements.append(Spacer(1, 0.8*inch))
        elements.append(Paragraph("DOCUMENT ANALYSIS REPORT", self.styles['CustomTitle']))
        elements.append(Spacer(1, 0.1*inch))
        
        info_data = [
            ['Source Document:', original_filename],
            ['Total Pages:', str(summary.page_count)],
            ['Analysis Date:', datetime.now().strftime('%B %d, %Y')],
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
        
        if summary.executive_summary:
            elements.append(Paragraph("EXECUTIVE SUMMARY", self.styles['SectionHeader']))
            elements.append(Spacer(1, 0.2*inch))
            for para in summary.executive_summary.split('\n'):
                if para.strip():
                    elements.append(Paragraph(para.strip(), self.styles['CustomBody']))
            elements.append(Spacer(1, 0.3*inch))
        
        if summary.key_findings:
            elements.append(Paragraph("KEY FINDINGS", self.styles['SectionHeader']))
            elements.append(Spacer(1, 0.1*inch))
            for i, finding in enumerate(summary.key_findings, 1):
                bullet_text = f"<b>{i}.</b> {finding}"
                elements.append(Paragraph(bullet_text, self.styles['CustomBullet']))
            elements.append(Spacer(1, 0.3*inch))

        if summary.financial_highlights:
            elements.append(Paragraph("FINANCIAL HIGHLIGHTS", self.styles['SectionHeader']))
            elements.append(Spacer(1, 0.1*inch))
            financial_data = [[k, v] for k, v in summary.financial_highlights.items()]
            if financial_data:
                fin_table = Table(financial_data, colWidths=self._calculate_column_widths(financial_data))
                elements.append(fin_table)
            elements.append(Spacer(1, 0.3*inch))

        if summary.important_dates:
            elements.append(Paragraph("IMPORTANT DATES", self.styles['SectionHeader']))
            elements.append(Spacer(1, 0.1*inch))
            for date in summary.important_dates:
                elements.append(Paragraph(f"• {date}", self.styles['CustomBullet']))
            elements.append(Spacer(1, 0.3*inch))
        
        if summary.risk_factors:
            elements.append(Paragraph("RISK FACTORS", self.styles['SectionHeader']))
            elements.append(Spacer(1, 0.1*inch))
            for i, risk in enumerate(summary.risk_factors, 1):
                elements.append(Paragraph(f"<b>{i}.</b> {risk}", self.styles['CustomBullet']))
            elements.append(Spacer(1, 0.3*inch))
        
        try:
            doc.build(elements)
            return True
        except Exception as e:
            print(f"Error generating PDF: {e}", file=sys.stderr)
            return False

if __name__ == "__main__":
    try:
        output_path = sys.argv[1]
        json_data = sys.stdin.read()
        data = json.loads(json_data)

        # Map the incoming JSON to the PDFSummary dataclass
        summary = PDFSummary(
            executive_summary=data.get("executive_summary", data.get("summary_preview", "No summary provided.")),
            key_findings=data.get("details", {}).get("key_findings", []),
            financial_highlights=data.get("details", {}).get("financial_highlights", {}),
            important_dates=data.get("details", {}).get("important_dates", []),
            risk_factors=data.get("details", {}).get("risk_factors", []),
            recommendations=data.get("details", {}).get("recommendations", []),
            page_count=data.get("details", {}).get("page_count", 0)
        )

        original_filename = data.get("details", {}).get("original_name", "Analysis Report")

        generator = PDFReportGenerator()
        success = generator.generate_pdf(summary, original_filename, output_path)
        
        if success:
            print(output_path)
        else:
            print(f"Error: Failed to generate PDF.", file=sys.stderr)
            sys.exit(1)

    except Exception as e:
        print(f"Error in report_generator.py: {e}", file=sys.stderr)