#!/bin/bash

# Countries API Test Script
# Tests all major endpoints of the new Countries API

echo "═══════════════════════════════════════════════════════════════════"
echo "COUNTRIES API - TEST SUITE"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

BASE_URL="http://localhost:3001"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Get all countries
echo -e "${YELLOW}Test 1: Get all countries${NC}"
echo "Request: GET $BASE_URL/api/countries"
echo ""
response=$(curl -s "$BASE_URL/api/countries")
count=$(echo "$response" | jq '.count' 2>/dev/null)
if [ "$count" -gt 0 ]; then
  echo -e "${GREEN}✓ PASS${NC} - Got $count countries"
  echo "Sample response:"
  echo "$response" | jq '.data[0:2]'
else
  echo -e "${RED}✗ FAIL${NC} - No countries returned"
fi
echo ""
echo "---"
echo ""

# Test 2: Filter by region (Asia)
echo -e "${YELLOW}Test 2: Filter by region (Asia)${NC}"
echo "Request: GET $BASE_URL/api/countries?region=Asia"
echo ""
response=$(curl -s "$BASE_URL/api/countries?region=Asia")
count=$(echo "$response" | jq '.count' 2>/dev/null)
if [ "$count" -gt 0 ]; then
  echo -e "${GREEN}✓ PASS${NC} - Got $count Asian countries"
  echo "Sample:"
  echo "$response" | jq '.data[0:3]'
else
  echo -e "${RED}✗ FAIL${NC} - No countries returned"
fi
echo ""
echo "---"
echo ""

# Test 3: Filter by region (Africa)
echo -e "${YELLOW}Test 3: Filter by region (Africa)${NC}"
echo "Request: GET $BASE_URL/api/countries?region=Africa"
echo ""
response=$(curl -s "$BASE_URL/api/countries?region=Africa")
count=$(echo "$response" | jq '.count' 2>/dev/null)
if [ "$count" -gt 0 ]; then
  echo -e "${GREEN}✓ PASS${NC} - Got $count African countries"
else
  echo -e "${RED}✗ FAIL${NC} - No countries returned"
fi
echo ""
echo "---"
echo ""

# Test 4: Search by name
echo -e "${YELLOW}Test 4: Search by country name${NC}"
echo "Request: GET $BASE_URL/api/countries?search=united"
echo ""
response=$(curl -s "$BASE_URL/api/countries?search=united")
count=$(echo "$response" | jq '.count' 2>/dev/null)
if [ "$count" -gt 0 ]; then
  echo -e "${GREEN}✓ PASS${NC} - Found $count countries matching 'united'"
  echo "Results:"
  echo "$response" | jq '.data'
else
  echo -e "${RED}✗ FAIL${NC} - No countries found"
fi
echo ""
echo "---"
echo ""

# Test 5: Get specific country by code
echo -e "${YELLOW}Test 5: Get specific country (US)${NC}"
echo "Request: GET $BASE_URL/api/countries/US"
echo ""
response=$(curl -s "$BASE_URL/api/countries/US")
name=$(echo "$response" | jq -r '.data.name' 2>/dev/null)
if [ "$name" = "United States" ]; then
  echo -e "${GREEN}✓ PASS${NC} - Got United States"
  echo "$response" | jq '.data'
else
  echo -e "${RED}✗ FAIL${NC} - Could not get United States"
fi
echo ""
echo "---"
echo ""

# Test 6: Get specific country by code (China)
echo -e "${YELLOW}Test 6: Get specific country (CN)${NC}"
echo "Request: GET $BASE_URL/api/countries/CN"
echo ""
response=$(curl -s "$BASE_URL/api/countries/CN")
name=$(echo "$response" | jq -r '.data.name' 2>/dev/null)
if [ "$name" = "China" ]; then
  echo -e "${GREEN}✓ PASS${NC} - Got China"
  echo "$response" | jq '.data'
else
  echo -e "${RED}✗ FAIL${NC} - Could not get China"
fi
echo ""
echo "---"
echo ""

# Test 7: Invalid country code (404)
echo -e "${YELLOW}Test 7: Invalid country code (should return 404)${NC}"
echo "Request: GET $BASE_URL/api/countries/XX"
echo ""
response=$(curl -s "$BASE_URL/api/countries/XX")
error=$(echo "$response" | jq -r '.error' 2>/dev/null)
if [[ "$error" == *"not found"* ]]; then
  echo -e "${GREEN}✓ PASS${NC} - Got expected 404 error"
  echo "$response" | jq '.'
else
  echo -e "${RED}✗ FAIL${NC} - Did not get expected error"
fi
echo ""
echo "---"
echo ""

# Test 8: Combined filters (region + search)
echo -e "${YELLOW}Test 8: Combined filters (Asia + 'korea')${NC}"
echo "Request: GET $BASE_URL/api/countries?region=Asia&search=korea"
echo ""
response=$(curl -s "$BASE_URL/api/countries?region=Asia&search=korea")
count=$(echo "$response" | jq '.count' 2>/dev/null)
if [ "$count" -gt 0 ]; then
  echo -e "${GREEN}✓ PASS${NC} - Found $count countries"
  echo "$response" | jq '.data'
else
  echo -e "${RED}✗ FAIL${NC} - No countries found"
fi
echo ""
echo "---"
echo ""

# Test 9: Check Swagger documentation
echo -e "${YELLOW}Test 9: Check Swagger documentation${NC}"
echo "Request: GET $BASE_URL/api-docs"
echo ""
response=$(curl -s "$BASE_URL/api-docs/")
if [[ "$response" == *"swagger-ui"* ]] || [[ "$response" == *"Swagger"* ]]; then
  echo -e "${GREEN}✓ PASS${NC} - Swagger UI is accessible"
  echo "Swagger available at: $BASE_URL/api-docs"
else
  echo -e "${RED}✗ FAIL${NC} - Swagger UI not accessible"
fi
echo ""
echo "---"
echo ""

echo "═══════════════════════════════════════════════════════════════════"
echo "TEST SUMMARY"
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo "All basic endpoint tests completed!"
echo ""
echo "To see full Swagger documentation:"
echo "  Open: $BASE_URL/api-docs"
echo ""
echo "To test with curl:"
echo "  curl '$BASE_URL/api/countries'"
echo "  curl '$BASE_URL/api/countries?region=Asia'"
echo "  curl '$BASE_URL/api/countries?search=india'"
echo "  curl '$BASE_URL/api/countries/US'"
echo ""
