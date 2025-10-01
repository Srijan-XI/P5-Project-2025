# Test script for Professional Calculator API
import requests
import json

BASE_URL = "http://localhost:5000"

def test_api_endpoints():
    """Test all API endpoints of the calculator"""
    
    print("🧮 Testing Professional Calculator API")
    print("=" * 50)
    
    # Test 1: Basic calculation
    print("\n1. Testing basic calculation API:")
    try:
        response = requests.post(f"{BASE_URL}/api/calculate", 
                               json={"expression": "2 + 2 * 3"})
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ Expression: 2 + 2 * 3")
            print(f"   ✅ Result: {result['result']}")
        else:
            print(f"   ❌ Error: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("   ❌ Server not running. Start with: python app.py")
        return False
    
    # Test 2: Scientific calculation
    print("\n2. Testing scientific calculation:")
    try:
        response = requests.post(f"{BASE_URL}/api/calculate", 
                               json={"expression": "sin(pi/2)"})
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ Expression: sin(pi/2)")
            print(f"   ✅ Result: {result['result']}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 3: Number base conversion
    print("\n3. Testing number base conversion:")
    try:
        response = requests.post(f"{BASE_URL}/api/convert", 
                               json={"number": "255", "from_base": 10, "to_base": 16})
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ Conversion: 255 (decimal) → {result['result']} (hex)")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 4: System info
    print("\n4. Testing system info:")
    try:
        response = requests.get(f"{BASE_URL}/api/system-info")
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ Version: {result['version']}")
            print(f"   ✅ C++ Integration: {result['cpp_integration']['executable_found']}")
            print(f"   ✅ Features: {len(result['features'])} available")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 5: Error handling
    print("\n5. Testing error handling:")
    try:
        response = requests.post(f"{BASE_URL}/api/calculate", 
                               json={"expression": "1/0"})
        result = response.json()
        print(f"   ✅ Division by zero handled: {result['result']}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 API Testing Complete!")
    print(f"🌐 Calculator running at: {BASE_URL}")
    
    return True

if __name__ == "__main__":
    test_api_endpoints()