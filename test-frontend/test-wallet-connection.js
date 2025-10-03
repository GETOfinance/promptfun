// Test script for wallet connection debugging
// Run this in the browser console to test wallet connection

console.log("=== WALLET CONNECTION TEST SCRIPT ===");

// Test 1: Check if window.aptos exists
function testWindowAptos() {
  console.log("Test 1: Checking window.aptos");
  if (typeof window !== 'undefined' && window.aptos) {
    console.log("✅ window.aptos exists");
    console.log("window.aptos:", window.aptos);
    return true;
  } else {
    console.log("❌ window.aptos not found");
    console.log("This means Petra wallet extension is not installed or not detected");
    return false;
  }
}

// Test 2: Check wallet adapter state
function testWalletAdapter() {
  console.log("Test 2: Checking wallet adapter state");
  
  // This will only work if the React app is running
  if (typeof window !== 'undefined' && window.__WALLET_ADAPTER_CONTEXT__) {
    console.log("✅ Wallet adapter context found");
    return true;
  } else {
    console.log("❌ Wallet adapter context not found");
    console.log("Make sure the React app is running");
    return false;
  }
}

// Test 3: Check for common wallet extensions
function testWalletExtensions() {
  console.log("Test 3: Checking for wallet extensions");
  
  const extensions = [
    'petra',
    'martian',
    'fewcha',
    'hippo'
  ];
  
  let found = false;
  extensions.forEach(ext => {
    if (typeof window !== 'undefined' && window[ext]) {
      console.log(`✅ Found ${ext} wallet`);
      found = true;
    }
  });
  
  if (!found) {
    console.log("❌ No wallet extensions found");
    console.log("Please install Petra wallet from: https://petra.app/");
  }
  
  return found;
}

// Test 4: Simulate connection attempt
async function testConnection() {
  console.log("Test 4: Testing connection attempt");
  
  if (!window.aptos) {
    console.log("❌ Cannot test connection - window.aptos not available");
    return false;
  }
  
  try {
    console.log("Attempting to connect...");
    const response = await window.aptos.connect();
    console.log("✅ Connection successful:", response);
    return true;
  } catch (error) {
    console.log("❌ Connection failed:", error);
    console.log("Error code:", error.code);
    console.log("Error message:", error.message);
    return false;
  }
}

// Test 5: Check network connection
async function testNetworkConnection() {
  console.log("Test 5: Testing network connection");
  
  try {
    const response = await fetch('https://fullnode.testnet.aptoslabs.com/v1');
    if (response.ok) {
      console.log("✅ Network connection successful");
      return true;
    } else {
      console.log("❌ Network connection failed:", response.status);
      return false;
    }
  } catch (error) {
    console.log("❌ Network connection error:", error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log("Starting wallet connection tests...\n");
  
  const results = {
    windowAptos: testWindowAptos(),
    walletAdapter: testWalletAdapter(),
    walletExtensions: testWalletExtensions(),
    networkConnection: await testNetworkConnection(),
    connection: await testConnection()
  };
  
  console.log("\n=== TEST RESULTS ===");
  Object.entries(results).forEach(([test, result]) => {
    console.log(`${test}: ${result ? '✅ PASS' : '❌ FAIL'}`);
  });
  
  console.log("\n=== RECOMMENDATIONS ===");
  if (!results.windowAptos) {
    console.log("1. Install Petra wallet extension");
  }
  if (!results.walletExtensions) {
    console.log("2. Enable wallet extension in browser");
  }
  if (!results.networkConnection) {
    console.log("3. Check internet connection");
  }
  if (!results.connection) {
    console.log("4. Try refreshing the page and reconnecting");
  }
  
  return results;
}

// Export for use in console
window.testWalletConnection = runAllTests;

console.log("To run tests, type: testWalletConnection()");
console.log("=========================================="); 