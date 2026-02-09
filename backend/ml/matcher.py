import pandas as pd
from pymongo import MongoClient
from datetime import datetime
import os
import sys
import io
import argparse
import json
import traceback

# Setting stdout encoding for better console output handling
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

class CompanyMatcher:
    def __init__(self, connection_string, database_name='buyer_Seller_matching', collection_name='ferro_alloy_master', silent=False):
        """Initialize the matcher with MongoDB connection"""
        self.silent = silent
        
        if not self.silent:
            sys.stderr.write("🔗 Connecting to MongoDB Atlas...\n")
        
        try:
            # Connect to MongoDB
            self.client = MongoClient(connection_string, serverSelectionTimeoutMS=5000)
            self.db = self.client[database_name]
            self.collection = self.db[collection_name]
            
            # Test connection
            self.client.server_info()
            if not self.silent:
                sys.stderr.write("✅ Successfully connected to MongoDB!\n")
            
            # Load data into DataFrame
            if not self.silent:
                sys.stderr.write("📥 Loading data from MongoDB...\n")
            
            data = list(self.collection.find())
            
            if not data:
                raise Exception("No data found in MongoDB collection!")
            
            self.df = pd.DataFrame(data)
            
            if '_id' in self.df.columns:
                self.df = self.df.drop('_id', axis=1)
            
            if not self.silent:
                sys.stderr.write(f"✅ Loaded {len(self.df)} companies from database\n")
            
            self.clean_data()
            
        except Exception as e:
            sys.stderr.write(f"❌ FATAL: MongoDB Connection Error: {str(e)}\n")
            raise
    
    def clean_data(self):
        """Clean and prepare the data"""
        numeric_columns = ['annual revenue (cr)', 'net profit (cr)', 'debt-to-equity ratio', 
                           'ebitda margin (%)', 'production capacity (mt)', 'active_nclt_cases']
        
        for col in numeric_columns:
            if col in self.df.columns:
                self.df[col] = pd.to_numeric(self.df[col], errors='coerce')
        
        if 'credit rating' in self.df.columns:
            self.df['credit rating'] = self.df['credit rating'].fillna('Not Available')
            self.df['credit rating'] = self.df['credit rating'].astype(str).str.strip()
            
    def get_credit_score_value(self, rating):
        """Convert credit rating to numeric score for comparison"""
        rating_scores = {
            'CRISIL AAA': 10, 'CRISIL AA+': 9.5, 'CRISIL AA': 9, 'CRISIL AA-': 8.5,
            'CRISIL A+': 8, 'CRISIL A': 7.5, 'CRISIL A-': 7,
            'CRISIL BBB+': 6.5, 'CRISIL BBB': 6, 'CRISIL BBB-': 5.5,
            'CRISIL BB+': 5, 'CRISIL BB': 4.5, 'CRISIL BB-': 4,
            'CARE AAA': 10, 'CARE AA+': 9.5, 'CARE AA': 9, 'CARE AA-': 8.5,
            'CARE A+': 8, 'CARE A': 7.5, 'CARE A-': 7,
            'CARE BBB+': 6.5, 'CARE BBB': 6, 'CARE BBB-': 5.5,
            'CARE BB+': 5, 'CARE BB': 4.5, 'CARE BB-': 4,
            'IND AAA': 10, 'IND AA+': 9.5, 'IND AA': 9, 'IND AA-': 8.5,
            'IND A+': 8, 'IND A': 7.5, 'IND A-': 7,
            'IND BBB+': 6.5, 'IND BBB': 6, 'IND BBB-': 5.5,
            'IND BB+': 5, 'IND BB': 4.5, 'IND BB-': 4,
            'IND D': 1, 'IND D(suspended)': 0,
            'Not Available': 0
        }
        
        for key in rating_scores:
            if key in str(rating).upper():
                return rating_scores[key]
        return 0

    def is_bbb_or_above(self, rating):
        """Check if credit rating is BBB- or above (score >= 5.5)"""
        score = self.get_credit_score_value(rating)
        return score >= 5.5
    
    def get_company_details(self, company_name):
        """Get detailed information about a company"""
        company = self.df[self.df['company'].str.lower() == company_name.lower()]
        
        if company.empty:
            return None
        
        company = company.iloc[0]
        return {
            'name': company['company'],
            'city': company.get('city', 'N/A'),
            'state': company.get('state', 'N/A'),
            'revenue': company.get('annual revenue (cr)', None),
            'net_profit': company.get('net profit (cr)', None),
            'credit_rating': company.get('credit rating', 'Not Available'),
            'credit_score': self.get_credit_score_value(company.get('credit rating', 'Not Available')),
            'debt_to_equity': company.get('debt-to-equity ratio', None),
            'ebitda_margin': company.get('ebitda margin (%)', None),
            'production_capacity': company.get('production capacity (mt)', None),
            'active_nclt_cases': company.get('active_nclt_cases', 0),
            'nclt_status': company.get('nclt_status', 'N/A'),
            'company_status': company.get('company status', 'N/A'),
            'age': company.get('age of company', 'N/A'),
            'product': company.get('product', 'N/A'),
            'listed': company.get('listed on stock exchange', 'N/A'),
            'address': company.get('address', 'N/A'),
            'phone': company.get('phone', 'N/A'),
            'email': company.get('email', 'N/A'),
            'website': company.get('website', 'N/A'),
            'cin': company.get('cin', 'N/A'),
            'nic_code': company.get('NIC Code', 'N/A'),
            'nic_description': company.get('NIC Description', 'N/A')
        }

    def find_potential_sellers(self, buyer_name):
        """Find potential acquisition targets (sellers) for a buyer company"""
        buyer = self.get_company_details(buyer_name)
        
        if not buyer:
            return [], None 
        
        potential_sellers = []
        
        for idx, row in self.df.iterrows():
            if str(row.get('company', '')).lower() == buyer_name.lower():
                continue
            
            seller_details = self.get_company_details(row.get('company', ''))
            
            seller_revenue = seller_details['revenue']
            seller_rating = seller_details['credit_rating']
            seller_credit_score = seller_details['credit_score']
            buyer_revenue = buyer['revenue']
            
            criteria_met = []
            reasons = []

            # Criterion 1: Revenue Range
            if pd.notna(buyer_revenue) and pd.notna(seller_revenue):
                min_target_revenue = buyer_revenue * 0.10
                max_target_revenue = buyer_revenue * 0.50
                if min_target_revenue <= seller_revenue <= max_target_revenue:
                    criteria_met.append("✓ Ideal Revenue Fit (10%-50% of Buyer's Revenue)")
                    reasons.append(f"Target Revenue: ₹{seller_revenue} Cr (Buyer: ₹{buyer_revenue} Cr)")
                elif seller_revenue < min_target_revenue:
                    reasons.append(f"Target Revenue: ₹{seller_revenue} Cr (Small Target)")
                else: 
                    reasons.append(f"Target Revenue: ₹{seller_revenue} Cr (Large Target)")
            elif pd.notna(seller_revenue):
                reasons.append(f"Target Revenue: ₹{seller_revenue} Cr (Buyer Revenue N/A)")
            
            # Criterion 2: NIC Description match
            buyer_nic = buyer.get('nic_description', '')
            seller_nic = seller_details.get('nic_description', '')
            if pd.notna(seller_nic) and pd.notna(buyer_nic) and buyer_nic:
                if str(seller_nic).strip().lower() == str(buyer_nic).strip().lower():
                    criteria_met.append("✓ Exact Industry Match (Synergy)")
                    reasons.append(f"Industry: {str(seller_nic)[:50]}...")
                elif 'iron' in str(seller_nic).lower() and 'iron' in str(buyer_nic).lower():
                    criteria_met.append("✓ Related Iron Industry")
                    reasons.append(f"Industry: {str(seller_nic)[:50]}...")
            
            # Criterion 3: Profitability
            ebitda_col = 'ebitda margin (%)'
            if pd.notna(row.get(ebitda_col)):
                if row[ebitda_col] >= 5: 
                    criteria_met.append("✓ Profitable Target (> 5% EBITDA)")
                    reasons.append(f"EBITDA Margin: {row[ebitda_col]}%")
                elif row[ebitda_col] > 0:
                    reasons.append(f"EBITDA Margin: {row[ebitda_col]}%")

            # Criterion 4: Credit Rating
            if seller_credit_score >= buyer['credit_score']:
                criteria_met.append("✓ Good Credit Rating (Similar/Better)")
                reasons.append(f"Rating: {seller_rating} (Score: {seller_credit_score:.1f})")
            else:
                reasons.append(f"Rating: {seller_rating} (Lower than Buyer)")

            # Criterion 5: Low Legal Issues
            if pd.notna(row.get('active_nclt_cases')) and row['active_nclt_cases'] == 0:
                criteria_met.append("✓ No Legal Issues")
            
            if len(criteria_met) >= 2:
                potential_sellers.append({
                    'company': seller_details['name'],
                    'city': seller_details['city'],
                    'state': seller_details['state'],
                    'credit_rating': seller_rating,
                    'credit_score': seller_credit_score,
                    'revenue': float(seller_revenue) if pd.notna(seller_revenue) else None,
                    'ebitda_margin': float(seller_details.get('ebitda_margin')) if pd.notna(seller_details.get('ebitda_margin')) else None,
                    'debt_to_equity': float(seller_details.get('debt_to_equity')) if pd.notna(seller_details.get('debt_to_equity')) else None,
                    'nclt_cases': int(seller_details.get('active_nclt_cases', 0)),
                    'criteria_met': criteria_met,
                    'reasons': reasons,
                    'full_data': row.to_dict() 
                })
        
        potential_sellers = sorted(potential_sellers, 
                                     key=lambda x: (
                                         'Exact Industry Match' in str(x['criteria_met']), 
                                         'Profitable Target (> 5% EBITDA)' in str(x['criteria_met']), 
                                         x['credit_score']
                                     ), 
                                     reverse=True)
        
        return potential_sellers, buyer
    
    def find_potential_buyers(self, seller_name):
        """Find potential acquisition buyers for a seller company"""
        seller = self.get_company_details(seller_name)
        
        if not seller:
            return [], None
            
        potential_buyers = []
        
        seller_revenue = seller['revenue']
        seller_nic = seller.get('nic_description', '')

        for idx, row in self.df.iterrows():
            if str(row.get('company', '')).lower() == seller_name.lower():
                continue
            
            buyer_details = self.get_company_details(row.get('company', ''))
            
            if not buyer_details: 
                continue 
            
            buyer_revenue = buyer_details['revenue']
            buyer_credit_score = buyer_details['credit_score']
            buyer_rating = buyer_details['credit_rating']
            
            criteria_met = []
            reasons = []
            
            # Criterion 1: Revenue Capacity
            if pd.notna(buyer_revenue) and pd.notna(seller_revenue):
                min_buyer_revenue = seller_revenue * 5
                if buyer_revenue > min_buyer_revenue:
                    criteria_met.append("✓ Strong Revenue Capacity (Buyer > 5x Seller)")
                    reasons.append(f"Buyer Revenue: ₹{buyer_revenue} Cr (Min required: ₹{min_buyer_revenue:.2f} Cr)")
                else:
                    reasons.append(f"Buyer Revenue: ₹{buyer_revenue} Cr (Too small relative to Seller)")
            elif pd.notna(buyer_revenue):
                 reasons.append(f"Buyer Revenue: ₹{buyer_revenue} Cr (Seller Revenue N/A)")
            
            # Criterion 2: Credit Strength
            if buyer_credit_score >= 8.5: 
                criteria_met.append("✓ Excellent Credit Rating (AA- or better)")
                reasons.append(f"Rating: {buyer_rating} (Score: {buyer_credit_score:.1f})")
            elif buyer_credit_score >= 7.0:
                criteria_met.append("✓ Strong Credit Rating (A or better)")
                reasons.append(f"Rating: {buyer_rating} (Score: {buyer_credit_score:.1f})")
            else:
                reasons.append(f"Rating: {buyer_rating} (Below desirable threshold)")

            # Criterion 3: Industry Match 
            buyer_nic = buyer_details.get('nic_description', '')
            if pd.notna(seller_nic) and pd.notna(buyer_nic) and seller_nic:
                if str(seller_nic).strip().lower() == str(buyer_nic).strip().lower():
                    criteria_met.append("✓ Exact Industry Match (Synergy)")
                    reasons.append(f"Industry: {str(buyer_nic)[:50]}...")
                elif 'iron' in str(seller_nic).lower() and 'iron' in str(buyer_nic).lower():
                    criteria_met.append("✓ Related Iron Industry")
                    reasons.append(f"Industry: {str(buyer_nic)[:50]}...")
                    
            # Criterion 4: Low Legal Issues
            if pd.notna(row.get('active_nclt_cases')) and row['active_nclt_cases'] == 0:
                criteria_met.append("✓ No Legal Issues")
            
            if len(criteria_met) >= 2:
                potential_buyers.append({
                    'company': buyer_details['name'],
                    'city': buyer_details['city'],
                    'state': buyer_details['state'],
                    'credit_rating': buyer_rating,
                    'credit_score': buyer_credit_score,
                    'revenue': float(buyer_revenue) if pd.notna(buyer_revenue) else None,
                    'ebitda_margin': float(buyer_details.get('ebitda_margin')) if pd.notna(buyer_details.get('ebitda_margin')) else None,
                    'debt_to_equity': float(buyer_details.get('debt_to_equity')) if pd.notna(buyer_details.get('debt_to_equity')) else None,
                    'nclt_cases': int(buyer_details.get('active_nclt_cases', 0)),
                    'criteria_met': criteria_met,
                    'reasons': reasons,
                    'full_data': row.to_dict() 
                })
        
        potential_buyers = sorted(potential_buyers, 
                                     key=lambda x: (
                                         x['credit_score'],
                                         x['revenue'] if pd.notna(x['revenue']) else -1
                                     ), 
                                     reverse=True)
                                     
        return potential_buyers, seller

    def __del__(self):
        try:
            if hasattr(self, "client"):
                self.client.close()
        except Exception:
            pass 

def main():
    try:
        parser = argparse.ArgumentParser()
        parser.add_argument('--company', required=True, help='The company name for matching.')
        parser.add_argument('--role', required=True, help='The role of the company (buyer or seller).')
        parser.add_argument('--industry', required=True, help='Mandatory industry filter.')
        parser.add_argument('--creditRating', default='', help='Minimum credit rating.')
        parser.add_argument('--annualRevenue', default='', help='Minimum annual revenue (Cr).')
        parser.add_argument('--netProfit', default='', help='Minimum net profit (Cr).')
        parser.add_argument('--debtToEquity', default='', help='Maximum debt-to-equity ratio.')
        parser.add_argument('--ebitdaMargin', default='', help='Minimum EBITDA margin (%).')
        parser.add_argument('--prodCapacity', default='', help='Minimum production capacity (MT).')
        parser.add_argument('--ncltCases', default='', help='Maximum active NCLT cases.')
        args = parser.parse_args()

        # Get connection string
        mongo_uri = os.environ.get('MONGO_URI')
        if not mongo_uri:
            result = {"error": "Configuration Error", "details": "MONGO_URI environment variable not set"}
            print(json.dumps(result))
            sys.exit(1)
            
        # Instantiate the matcher in SILENT mode
        matcher = CompanyMatcher(mongo_uri, silent=True) 
        
        # Perform initial matching based on role
        if args.role.lower() == 'seller':
            potential_buyers, seller_details = matcher.find_potential_buyers(args.company)
            if seller_details is None:
                result = {"error": "Company not found", "details": f"'{args.company}' not found in database"}
                print(json.dumps(result))
                sys.exit(1)
            matches = potential_buyers
            match_type = "potential_buyers"
        elif args.role.lower() == 'buyer':
            potential_sellers, buyer_details = matcher.find_potential_sellers(args.company)
            if buyer_details is None:
                result = {"error": "Company not found", "details": f"'{args.company}' not found in database"}
                print(json.dumps(result))
                sys.exit(1)
            matches = potential_sellers
            match_type = "potential_sellers"
        else:
            result = {"error": "Invalid role", "details": f"Role must be 'buyer' or 'seller', received '{args.role}'"}
            print(json.dumps(result))
            sys.exit(1)

        # Apply mandatory industry filter
        industry_lower = args.industry.lower()
        filtered_matches = [
            m for m in matches
            if pd.notna(m.get('full_data', {}).get('NIC Description', '')) and 
               industry_lower in str(m['full_data']['NIC Description']).lower()
        ]

        # Apply advanced filters
        def apply_advanced_filters(match_list):
            result = []
            for m in match_list:
                row = m['full_data']
                include = True

                if args.creditRating and include:
                    min_score = matcher.get_credit_score_value(args.creditRating)
                    if pd.isna(row.get('credit rating')) or matcher.get_credit_score_value(row['credit rating']) < min_score:
                        include = False

                if args.annualRevenue and include:
                    try:
                        min_rev = float(args.annualRevenue)
                        if pd.isna(row.get('annual revenue (cr)')) or row['annual revenue (cr)'] < min_rev:
                            include = False
                    except ValueError:
                        pass

                if args.netProfit and include:
                    try:
                        min_profit = float(args.netProfit)
                        if pd.isna(row.get('net profit (cr)')) or row['net profit (cr)'] < min_profit:
                            include = False
                    except ValueError:
                        pass

                if args.debtToEquity and include:
                    try:
                        max_debt = float(args.debtToEquity)
                        if pd.isna(row.get('debt-to-equity ratio')) or row['debt-to-equity ratio'] > max_debt:
                            include = False
                    except ValueError:
                        pass

                if args.ebitdaMargin and include:
                    try:
                        min_ebitda = float(args.ebitdaMargin)
                        if pd.isna(row.get('ebitda margin (%)')) or row['ebitda margin (%)'] < min_ebitda:
                            include = False
                    except ValueError:
                        pass

                if args.prodCapacity and include:
                    try:
                        min_capacity = float(args.prodCapacity)
                        if pd.isna(row.get('production capacity (mt)')) or row['production capacity (mt)'] < min_capacity:
                            include = False
                    except ValueError:
                        pass

                if args.ncltCases and include:
                    try:
                        max_cases = int(args.ncltCases)
                        if pd.isna(row.get('active_nclt_cases')) or row['active_nclt_cases'] > max_cases:
                            include = False
                    except ValueError:
                        pass

                if include:
                    result.append(m)
            return result

        filtered_matches = apply_advanced_filters(filtered_matches)

        # Prepare result data (filter out 'full_data' for payload)
        matches_data = []
        for m in filtered_matches:
            matches_data.append({
                "company": m['company'],
                "city": m['city'],
                "state": m['state'],
                "credit_rating": m['credit_rating'],
                "credit_score": m['credit_score'],
                "revenue": m['revenue'],
                "ebitda_margin": m['ebitda_margin'],
                "debt_to_equity": m['debt_to_equity'],
                "nclt_cases": m['nclt_cases'],
                "criteria": m['criteria_met'],
                "reasons": m['reasons']
            })

        result = {
            "role": args.role.lower(),
            "company": args.company,
            "industry": args.industry,
            "match_type": match_type,
            "total_matches": len(matches_data),
            "matches": matches_data
        }

        # Print ONLY the JSON result to stdout
        print(json.dumps(result))
        sys.exit(0)

    except Exception as e:
        error_result = {
            "error": "Python runtime error", 
            "details": str(e),
            "traceback": traceback.format_exc()
        }
        print(json.dumps(error_result))
        sys.exit(1)
        
if __name__ == '__main__':
    main()