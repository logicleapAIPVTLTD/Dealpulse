import pandas as pd
import os
from datetime import datetime
import boto3
from botocore.exceptions import ClientError
from typing import Dict, List, Optional, Tuple
import logging
from dotenv import load_dotenv
import json
import argparse
import sys
from decimal import Decimal

# Ensure environment variables are loaded if using dotenv
load_dotenv() 

logger = logging.getLogger(__name__)

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

class CompanyMatcher:
    def __init__(self, silent: bool = False):
        """Initialize the matcher with DynamoDB"""
        if not silent:
             logger.info("🔗 Connecting to DynamoDB...")

        # Load AWS credentials and config from environment
        region = os.getenv("DYNAMO_REGION", "us-west-2")
        access_key = os.getenv("DYNAMO_ACCESS_KEY")
        secret_key = os.getenv("DYNAMO_SECRET_KEY")
        table_name = os.getenv("DYNAMO_TABLE_NAME", "financial_companies_master")

        # The check for credentials is now done in main(), but good practice to keep here too
        if not access_key or not secret_key:
            # If not provided, raise error unless in a mock environment
            raise ValueError("AWS credentials not found in environment variables")

        try:
            # Connect to DynamoDB
            dynamodb = boto3.resource(
                "dynamodb",
                region_name=region,
                aws_access_key_id=access_key,
                aws_secret_access_key=secret_key,
            )

            table = dynamodb.Table(table_name)
            if not silent:
                 logger.info(f"✅ Connected to DynamoDB table: {table_name}")

            # Read all records
            if not silent:
                logger.info("📥 Loading data from DynamoDB...")
            items = []
            response = table.scan()
            items.extend(response.get("Items", []))

            # Continue if paginated
            while "LastEvaluatedKey" in response:
                response = table.scan(ExclusiveStartKey=response["LastEvaluatedKey"])
                items.extend(response.get("Items", []))

            if not items:
                raise Exception(f"No data found in DynamoDB table '{table_name}'!")

            self.df = pd.DataFrame(items)
            if not silent:
                logger.info(f"✅ Loaded {len(self.df)} companies from DynamoDB")

        except ClientError as e:
            logger.error(f"❌ DynamoDB Client Error: {e}")
            raise
        except Exception as e:
            logger.error(f"❌ Error connecting to DynamoDB: {e}")
            raise

        # Clean dataset after loading
        self.clean_data()
        
    def clean_data(self):
        """Clean and prepare the data"""
        numeric_columns = ['annual revenue (cr)', 'net profit (cr)', 'debt-to-equity ratio', 
                          'ebitda margin (%)', 'production capacity (mt)', 'active_nclt_cases']
        
        for col in numeric_columns:
            if col in self.df.columns:
                self.df[col] = self.df[col].replace('Not Available', pd.NA)
                self.df[col] = pd.to_numeric(self.df[col], errors='coerce')
        
        if 'credit rating' in self.df.columns:
            self.df['credit rating'] = self.df['credit rating'].fillna('Not Available')
            self.df['credit rating'] = self.df['credit rating'].str.strip()
    
    def get_credit_score_value(self, rating: str) -> float:
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
            'ICRA AAA': 10, 'ICRA AA+': 9.5, 'ICRA AA': 9, 'ICRA AA-': 8.5,
            'ICRA A+': 8, 'ICRA A': 7.5, 'ICRA A-': 7,
            'ICRA BBB+': 6.5, 'ICRA BBB': 6, 'ICRA BBB-': 5.5,
            'ICRA BB+': 5, 'ICRA BB': 4.5, 'ICRA BB-': 4,
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
    
    def is_bbb_or_above(self, rating: str) -> bool:
        """Check if credit rating is BBB or above"""
        score = self.get_credit_score_value(rating)
        return score >= 5.5
    
    def get_company_details(self, company_name: str) -> Optional[Dict]:
        """Get detailed information about a company"""
        company = self.df[self.df['company'].str.lower() == company_name.lower()]
        
        if company.empty:
            return None
        
        company = company.iloc[0]
        return {
            'name': company.get('company', 'N/A'),
            'city': company.get('city', 'N/A'),
            'state': company.get('state', 'N/A'),
            'revenue': float(company.get('annual revenue (cr)')) if pd.notna(company.get('annual revenue (cr)')) else None,
            'net_profit': float(company.get('net profit (cr)')) if pd.notna(company.get('net profit (cr)')) else None,
            'credit_rating': company.get('credit rating', 'Not Available'),
            'credit_score': self.get_credit_score_value(company.get('credit rating', 'Not Available')),
            'debt_to_equity': float(company.get('debt-to-equity ratio')) if pd.notna(company.get('debt-to-equity ratio')) else None,
            'ebitda_margin': float(company.get('ebitda margin (%)')) if pd.notna(company.get('ebitda margin (%)')) else None,
            'production_capacity': float(company.get('production capacity (mt)')) if pd.notna(company.get('production capacity (mt)')) else None,
            'active_nclt_cases': int(company.get('active_nclt_cases', 0)),
            'nclt_status': company.get('nclt_status', 'No Active Cases'),
            'company_status': company.get('company status', 'N/A'),
            'age': company.get('age of company', 'N/A'),
            'product': company.get('about', 'N/A'),
            'listed': company.get('listed on stock exchange', 'N/A'),
            'address': company.get('address', 'N/A'),
            'cin': company.get('cin', 'N/A'),
            'nic_code': company.get('NIC Code', 'N/A'),
            'nic_description': company.get('NIC Description', 'N/A'),
            'rating_agency': company.get('rating agency', 'N/A'),
            'report_year': company.get('report year', 'N/A')
        }

    
    def find_potential_buyers(self, seller_name: str, filters: Dict = {}) -> Tuple[Optional[List[Dict]], Optional[Dict]]:
        """
        Find potential buyers for a seller company, now with dynamic filter support.
        Filters can include: industry, credit_rating, revenue, net_profit, d_to_e, ebitda, capacity, nclt
        """
        seller = self.get_company_details(seller_name)
        
        if not seller:
            return None, None
        
        logger.info(f"Analyzing seller: {seller['name']}")
        
        potential_buyers = []
        
        for idx, row in self.df.iterrows():
            if row['company'].lower() == seller_name.lower():
                continue
            
            buyer_rating = row['credit rating']
            buyer_revenue = row['annual revenue (cr)']
            buyer_credit_score = self.get_credit_score_value(buyer_rating)
            seller_revenue = seller['revenue']
            
            criteria_met = []
            reasons = []
            
            # Mandatory: Credit Rating BBB or above
            if not self.is_bbb_or_above(buyer_rating):
                continue
            criteria_met.append("Credit Rating BBB+")
            
            # Apply dynamic filters
            # Industry filter
            if 'industry' in filters and filters['industry']:
                buyer_industry = row.get('NIC Description', '').lower()
                if filters['industry'].lower() not in buyer_industry:
                    continue  # Skip if industry doesn't match
            
            # Credit Rating filter (additional check beyond BBB+)
            if 'credit_rating' in filters and filters['credit_rating']:
                if filters['credit_rating'].lower() not in buyer_rating.lower():
                    continue
            
            # Revenue filter (e.g., '>100', '100-500')
            if 'revenue' in filters and filters['revenue']:
                if pd.notna(buyer_revenue):
                    if not self._matches_range_filter(buyer_revenue, filters['revenue']):
                        continue
                else:
                    continue  # Skip if no revenue data and filter is set
            
            # Net Profit filter
            buyer_net_profit = row.get('net profit (cr)')
            if 'net_profit' in filters and filters['net_profit']:
                if pd.notna(buyer_net_profit):
                    if not self._matches_range_filter(buyer_net_profit, filters['net_profit']):
                        continue
                else:
                    continue
            
            # Debt-to-Equity filter
            buyer_d_to_e = row.get('debt-to-equity ratio')
            if 'd_to_e' in filters and filters['d_to_e']:
                if pd.notna(buyer_d_to_e):
                    if not self._matches_range_filter(buyer_d_to_e, filters['d_to_e']):
                        continue
                else:
                    continue
            
            # EBITDA filter
            buyer_ebitda = row.get('ebitda margin (%)')
            if 'ebitda' in filters and filters['ebitda']:
                if pd.notna(buyer_ebitda):
                    if not self._matches_range_filter(buyer_ebitda, filters['ebitda']):
                        continue
                else:
                    continue
            
            # Production Capacity filter
            buyer_capacity = row.get('production capacity (mt)')
            if 'capacity' in filters and filters['capacity']:
                if pd.notna(buyer_capacity):
                    if not self._matches_range_filter(buyer_capacity, filters['capacity']):
                        continue
                else:
                    continue
            
            # NCLT Cases filter
            buyer_nclt = row.get('active_nclt_cases', 0)
            if 'nclt' in filters and filters['nclt']:
                if filters['nclt'] == 'no' and buyer_nclt > 0:
                    continue
                elif filters['nclt'] == 'yes' and buyer_nclt == 0:
                    continue
                # 'any' means no filter
            
            # Revenue comparison (existing logic)
            if pd.notna(buyer_revenue) and pd.notna(seller_revenue):
                if buyer_revenue >= seller_revenue * 1.2:
                    criteria_met.append("Strong Financial Capacity")
                    reasons.append(f"Revenue ₹{buyer_revenue} Cr (vs Seller ₹{seller_revenue} Cr)")
                elif buyer_revenue >= seller_revenue:
                    criteria_met.append("Adequate Financial Capacity")
                    reasons.append(f"Revenue ₹{buyer_revenue} Cr")
            elif pd.notna(buyer_revenue) and pd.isna(seller_revenue):
                criteria_met.append("Has Revenue Data")
                reasons.append(f"Revenue ₹{buyer_revenue} Cr")
            
            # Credit score comparison
            if buyer_credit_score > seller['credit_score']:
                criteria_met.append("Better Credit Rating")
                reasons.append(f"Rating: {buyer_rating} (Score: {buyer_credit_score:.1f})")
            elif buyer_credit_score >= seller['credit_score']:
                reasons.append(f"Rating: {buyer_rating}")
            
            # NIC Description match
            seller_nic = seller.get('nic_description', '')
            buyer_nic = row.get('NIC Description', '')
            if pd.notna(buyer_nic) and pd.notna(seller_nic) and seller_nic:
                if str(buyer_nic).strip().lower() == str(seller_nic).strip().lower():
                    criteria_met.append("Same Industry Category")
                    reasons.append(f"Industry: {str(buyer_nic)[:50]}...")
                elif 'iron' in str(buyer_nic).lower() and 'iron' in str(seller_nic).lower():
                    criteria_met.append("Related Industry")
                    reasons.append(f"Industry: {str(buyer_nic)[:50]}...")
                elif 'steel' in str(buyer_nic).lower() and 'steel' in str(seller_nic).lower():
                    criteria_met.append("Related Industry")
                    reasons.append(f"Industry: {str(buyer_nic)[:50]}...")
            
            # EBITDA margin
            ebitda_col = 'ebitda margin (%)'
            if ebitda_col in row.index and pd.notna(row[ebitda_col]):
                if row[ebitda_col] >= 10:
                    criteria_met.append("Strong Profitability")
                    reasons.append(f"EBITDA Margin: {row[ebitda_col]}%")
                elif row[ebitda_col] > 0:
                    reasons.append(f"EBITDA Margin: {row[ebitda_col]}%")
            
            # Debt-to-equity ratio
            if 'debt-to-equity ratio' in row.index and pd.notna(row['debt-to-equity ratio']):
                if row['debt-to-equity ratio'] <= 1.0:
                    criteria_met.append("Healthy Debt Levels")
                    reasons.append(f"D/E Ratio: {row['debt-to-equity ratio']:.2f}")
                else:
                    reasons.append(f"D/E Ratio: {row['debt-to-equity ratio']:.2f}")
            
            # NCLT cases
            if 'active_nclt_cases' in row.index and pd.notna(row['active_nclt_cases']):
                if row['active_nclt_cases'] == 0:
                    criteria_met.append("No Legal Issues")
                elif row['active_nclt_cases'] <= 2:
                    reasons.append(f"NCLT Cases: {int(row['active_nclt_cases'])}")
            
            # Company status
            if row.get('company status', '') == 'Active':
                criteria_met.append("Active Status")
            
            # Only add if at least 3 criteria are met
            if len(criteria_met) >= 3:
                potential_buyers.append({
                    'company': row['company'],
                    'city': row.get('city', 'N/A'),
                    'state': row.get('state', 'N/A'),
                    'credit_rating': buyer_rating,
                    'credit_score': buyer_credit_score,
                    'revenue': float(buyer_revenue) if pd.notna(buyer_revenue) else None,
                    'ebitda_margin': float(row.get('ebitda margin (%)')) if pd.notna(row.get('ebitda margin (%)')) else None,
                    'debt_to_equity': float(row.get('debt-to-equity ratio')) if pd.notna(row.get('debt-to-equity ratio')) else None,
                    'nclt_cases': int(row.get('active_nclt_cases', 0)),
                    'nclt_status': row.get('nclt_status', 'No Active Cases'),
                    'criteria_met': criteria_met,
                    'reasons': reasons,
                    'address': row.get('address', 'N/A'),
                    'cin': row.get('cin', 'N/A'),
                    'nic_code': row.get('NIC Code', 'N/A'),
                    'nic_description': row.get('NIC Description', 'N/A')
                })
        
        # Sort by credit score and revenue (made robust with .get() to avoid KeyError)
        potential_buyers = sorted(potential_buyers, 
                                key=lambda x: (x.get('credit_score', 0), 
                                             x.get('revenue', 0) if x.get('revenue') is not None else 0), 
                                reverse=True)
        
        return potential_buyers, seller
    
        
       
    
    def find_acquisition_targets(self, 
                                min_deal_size: float = 0,
                                max_deal_size: float = float('inf'),
                                location: Optional[str] = None,
                                require_good_rating: bool = True,
                                filters: Dict = {}) -> List[Dict]:
    
        logger.info(f"Searching for acquisition targets with filters: min={min_deal_size}, max={max_deal_size}, location={location}")
        
        potential_sellers = []
        
        for idx, row in self.df.iterrows():
            seller_revenue = row.get('annual revenue (cr)', pd.NA)
            seller_rating = row.get('credit rating', 'Not Available')
            seller_credit_score = self.get_credit_score_value(seller_rating)
            
            criteria_met = []
            reasons = []
            
            # Filter 1: Credit rating
            if require_good_rating:
                if not self.is_bbb_or_above(seller_rating):
                    continue
                criteria_met.append("Good Credit Rating (BBB+)")
            
            # Apply dynamic filters
            # Industry filter
            if 'industry' in filters and filters['industry']:
                seller_industry = row.get('NIC Description', '').lower()
                if filters['industry'].lower() not in seller_industry:
                    continue
            
            # Credit Rating filter (additional check)
            if 'credit_rating' in filters and filters['credit_rating']:
                if filters['credit_rating'].lower() not in seller_rating.lower():
                    continue
            
            # Revenue filter (overrides min/max if set)
            if 'revenue' in filters and filters['revenue']:
                if pd.notna(seller_revenue):
                    if not self._matches_range_filter(seller_revenue, filters['revenue']):
                        continue
                else:
                    continue
            
            # Net Profit filter
            seller_net_profit = row.get('net profit (cr)')
            if 'net_profit' in filters and filters['net_profit']:
                if pd.notna(seller_net_profit):
                    if not self._matches_range_filter(seller_net_profit, filters['net_profit']):
                        continue
                else:
                    continue
            
            # Debt-to-Equity filter
            seller_d_to_e = row.get('debt-to-equity ratio')
            if 'd_to_e' in filters and filters['d_to_e']:
                if pd.notna(seller_d_to_e):
                    if not self._matches_range_filter(seller_d_to_e, filters['d_to_e']):
                        continue
                else:
                    continue
            
            # EBITDA filter
            seller_ebitda = row.get('ebitda margin (%)')
            if 'ebitda' in filters and filters['ebitda']:
                if pd.notna(seller_ebitda):
                    if not self._matches_range_filter(seller_ebitda, filters['ebitda']):
                        continue
                else:
                    continue
            
            # Production Capacity filter
            seller_capacity = row.get('production capacity (mt)')
            if 'capacity' in filters and filters['capacity']:
                if pd.notna(seller_capacity):
                    if not self._matches_range_filter(seller_capacity, filters['capacity']):
                        continue
                else:
                    continue
            
            # NCLT Cases filter
            seller_nclt = row.get('active_nclt_cases', 0)
            if 'nclt' in filters and filters['nclt']:
                if filters['nclt'] == 'no' and seller_nclt > 0:
                    continue
                elif filters['nclt'] == 'yes' and seller_nclt == 0:
                    continue
            
            # Filter 2: Revenue in deal size range (existing logic, but can be overridden by revenue filter)
            if pd.notna(seller_revenue):
                if min_deal_size <= seller_revenue <= max_deal_size:
                    criteria_met.append("In Your Budget Range")
                    reasons.append(f"Revenue: ₹{seller_revenue} Cr")
                else:
                    continue
            else:
                if min_deal_size == 0:
                    reasons.append("Revenue: Data Not Available")
                else:
                    continue
            
            # Filter 3: Location (existing)
            if location:
                if row.get('state') and location.lower() in str(row.get('state', '')).lower():
                    criteria_met.append("Preferred Location")
                else:
                    continue
            
            # Additional positive factors
            seller_nic = row.get('NIC Description', '')
            if pd.notna(seller_nic):
                if 'manufacture of basic iron' in str(seller_nic).lower():
                    criteria_met.append("Core Finance Industry")
                    reasons.append("Industry: Iron & Steel Manufacturing")
                elif 'casting' in str(seller_nic).lower() or 'steel' in str(seller_nic).lower():
                    criteria_met.append("Related Industry")
                    reasons.append(f"Industry: {str(seller_nic)[:40]}...")
            
            ebitda_col = 'ebitda margin (%)'
            if ebitda_col in row.index and pd.notna(row[ebitda_col]):
                if row[ebitda_col] >= 10:
                    criteria_met.append("Strong Profitability")
                    reasons.append(f"EBITDA Margin: {row[ebitda_col]}%")
                elif row[ebitda_col] > 0:
                    reasons.append(f"EBITDA Margin: {row[ebitda_col]}%")
            
            if 'debt-to-equity ratio' in row.index and pd.notna(row['debt-to-equity ratio']):
                if row['debt-to-equity ratio'] <= 1.0:
                    criteria_met.append("Healthy Debt Levels")
                    reasons.append(f"D/E Ratio: {row['debt-to-equity ratio']:.2f}")
                else:
                    reasons.append(f"D/E Ratio: {row['debt-to-equity ratio']:.2f}")
            
            if 'active_nclt_cases' in row.index and pd.notna(row['active_nclt_cases']):
                if row['active_nclt_cases'] == 0:
                    criteria_met.append("No Legal Issues")
                elif row['active_nclt_cases'] <= 2:
                    reasons.append(f"NCLT Cases: {int(row['active_nclt_cases'])}")
                else:
                    reasons.append(f"⚠️ NCLT Cases: {int(row['active_nclt_cases'])}")
            
            if row.get('company status', '') == 'Active':
                criteria_met.append("Active Company")
            
            if pd.notna(row.get('production capacity (mt)', pd.NA)):
                criteria_met.append("Has Production Capacity")
                reasons.append(f"Capacity: {row.get('production capacity (mt)')} MT")
            
            if len(criteria_met) >= 2:
                potential_sellers.append({
                    'company': row.get('company', 'N/A'),
                    'city': row.get('city', 'N/A'),
                    'state': row.get('state', 'N/A'),
                    'credit_rating': seller_rating,
                    'credit_score': seller_credit_score,
                    'revenue': float(seller_revenue) if pd.notna(seller_revenue) else None,
                    'ebitda_margin': float(row.get('ebitda margin (%)')) if pd.notna(row.get('ebitda margin (%)')) else None,
                    'debt_to_equity': float(row.get('debt-to-equity ratio')) if pd.notna(row.get('debt-to-equity ratio')) else None,
                    'nclt_cases': int(row.get('active_nclt_cases', 0)),
                    'nclt_status': row.get('nclt_status', 'No Active Cases'),
                    'criteria_met': criteria_met,
                    'reasons': reasons,
                    'address': row.get('address', 'N/A'),
                    'cin': row.get('cin', 'N/A'),
                    'nic_code': row.get('NIC Code', 'N/A'),
                    'nic_description': row.get('NIC Description', 'N/A')
                })
        
        # Sort by credit score and revenue (made robust with .get() to avoid KeyError)
        potential_sellers = sorted(potential_sellers, 
                                  key=lambda x: (x.get('credit_score', 0), 
                                               x.get('revenue', 0) if x.get('revenue') is not None else 0), 
                                  reverse=True)
        
        return potential_sellers
    
    def _matches_range_filter(self, value: float, filter_str: str) -> bool:
        """
        Helper to check if a value matches a range filter like '>100', '<50', '100-500'.
        """
        import re
        if '>' in filter_str:
            min_val = float(filter_str.replace('>', '').strip())
            return value > min_val
        elif '<' in filter_str:
            max_val = float(filter_str.replace('<', '').strip())
            return value < max_val
        elif '-' in filter_str:
            parts = filter_str.split('-')
            min_val = float(parts[0].strip())
            max_val = float(parts[1].strip())
            return min_val <= value <= max_val
        else:
            # Exact match if no operator
            return value == float(filter_str)
    
    def get_all_companies(self) -> List[str]:
        """Get list of all companies in database"""
        return sorted(self.df['company'].unique().tolist())
    
    def get_available_states(self) -> List[str]:
        """Get list of available states"""
        return sorted(self.df['state'].dropna().unique().tolist())

    def find_companies_by_filter(self, args) -> List[Dict]:
        """
        Routes the matching request based on the company's role, now passing filters.
        """
        limit = getattr(args, 'limit', 20)
        
        # Collect filters from args
        filters = {
            'industry': getattr(args, 'industry', None),
            'credit_rating': getattr(args, 'credit_rating', None),
            'revenue': getattr(args, 'revenue', None),
            'net_profit': getattr(args, 'net_profit', None),
            'd_to_e': getattr(args, 'd_to_e', None),
            'ebitda': getattr(args, 'ebitda', None),
            'capacity': getattr(args, 'capacity', None),
            'nclt': getattr(args, 'nclt', None),
        }
        
        if args.role == 'seller':
            if not args.company:
                raise ValueError("Company name is required for seller role")
            
            buyers, _ = self.find_potential_buyers(args.company, filters=filters)
            
            if buyers is None:
                raise Exception(f"Seller company '{args.company}' not found in the database.")
                
            return buyers[:limit]
            
        # elif args.role == 'buyer':
        #     min_deal_size = float(args.revenue) if args.revenue else 0.0
            
        #     sellers = self.find_acquisition_targets(
        #         min_deal_size=min_deal_size,
        #         filters=filters
        #     )
            
        #     return sellers[:limit]
        elif args.role == 'buyer':
            min_deal_size = float(args.revenue) if args.revenue else 0.0
            max_deal_size = float(args.max_deal) if hasattr(args, 'max_deal') and args.max_deal else float('inf')
            location = args.location if hasattr(args, 'location') else None
            require_rating = args.require_rating.lower() == 'true' if hasattr(args, 'require_rating') else True
            
            sellers = self.find_acquisition_targets(
                min_deal_size=min_deal_size,
                max_deal_size=max_deal_size,
                location=location,
                require_good_rating=require_rating,
                filters=filters
            )
            
        else:
            raise ValueError(f"Invalid role '{args.role}'. Role must be 'seller' or 'buyer'.")


def main():
    # --- THIS SECTION FIXES THE CRASH ---
    parser = argparse.ArgumentParser(description="Company Matcher for Finance Industry")
    
    # Main args
    
    parser.add_argument('--company', required=False, help='The company name to exclude from results/details for seller role.')
    parser.add_argument('--role', required=True, help='The role of the company (buyer or seller).')
    
    # Advanced filters (accepted by argparse, but need implementation in matching methods)
    parser.add_argument('--industry', required=False, help='Industry to filter by.')
    parser.add_argument('--credit_rating', required=False, help='Credit rating to filter by.')
    parser.add_argument('--revenue', required=False, help='Annual revenue filter (used as min_deal_size for buyer role).')
    parser.add_argument('--net_profit', required=False, help='Net profit filter.')
    parser.add_argument('--d_to_e', required=False, help='Debt-to-Equity filter.')
    parser.add_argument('--ebitda', required=False, help='EBITDA margin filter.')
    parser.add_argument('--capacity', required=False, help='Production capacity filter.')
    parser.add_argument('--nclt', required=False, help='NCLT cases filter (any, yes, no).')
    parser.add_argument('--limit', type=int, default=10, help="Max number of results to return (applied after matching).")
    parser.add_argument('--max_deal', required=False, type=float, help='Maximum deal size for buyer role.')
    parser.add_argument('--location', required=False, help='Location filter for buyer role.')
    parser.add_argument('--require_rating', required=False, default='true', help='Require good rating (true/false) for buyer role.')    
    
    args = parser.parse_args()
    # ------------------------------------

    # Check for DynamoDB credentials (as used in CompanyMatcher.__init__)
    access_key = os.environ.get('DYNAMO_ACCESS_KEY')
    secret_key = os.environ.get('DYNAMO_SECRET_KEY')
    
    if not access_key or not secret_key:
        sys.stderr.write(json.dumps({
            "error": "Configuration Error", 
            "details": "DYNAMO_ACCESS_KEY and DYNAMO_SECRET_KEY environment variables must be set."
        }, cls=DecimalEncoder) + "\n")
        sys.exit(1)
        
    try:
        # Initialize the matcher. silent=True prevents excessive logging in CLI run.
        matcher = CompanyMatcher(silent=True) 
        
        # Use the new filter-based function which routes the request
        matches_data = matcher.find_companies_by_filter(args)
        
        result = {
            "role": args.role,
            "company": args.company if args.company else "N/A",
            "match_type": f"potential_{'sellers' if args.role == 'buyer' else 'buyers'}",
            "matches": matches_data
        }
        
        # Output result as a single line JSON string
        print(json.dumps(result, cls=DecimalEncoder, indent=None)) 

    except Exception as e:
        error_result = {"error": "Python runtime error during matching", "details": str(e)}
        # Write error to stderr for proper logging/piping
        sys.stderr.write(json.dumps(error_result, cls=DecimalEncoder) + "\n")
        sys.exit(1)
            
if __name__ == '__main__':
    # Set up basic logging (optional, but good practice)
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    main()
