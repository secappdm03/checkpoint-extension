// Appliance Info Viewer - SmartConsole Extension
// This script runs inside the extension window

async function loadGatewayInfo() {
    const gatewayDiv = document.getElementById('gateway-info');
    const policyDiv = document.getElementById('policy-info');
    
    gatewayDiv.innerHTML = '<div class="loading">Loading gateways...</div>';
    policyDiv.innerHTML = '<div class="loading">Loading policy packages...</div>';
    
    try {
        // Get gateway information using Management API
        const gatewaysResponse = await callManagementAPI("show-simple-gateways", {
            "details-level": "full",
            "limit": 50
        });
        
        if (gatewaysResponse.objects && gatewaysResponse.objects.length > 0) {
            let html = '';
            gatewaysResponse.objects.forEach(gw => {
                html += `
                    <div class="policy-status">
                        <strong>${gw.name || 'N/A'}</strong><br>
                        Type: ${gw.type || 'N/A'}<br>
                        Version: ${gw.version || 'N/A'}<br>
                        IPv4: ${gw.ipv4_address || 'N/A'}<br>
                        UID: ${gw.uid || 'N/A'}
                    </div>
                `;
            });
            gatewayDiv.innerHTML = html;
        } else {
            gatewayDiv.innerHTML = '<p>No gateways found.</p>';
        }
        
        // Get policy packages
        const packagesResponse = await callManagementAPI("show-packages", {
            "details-level": "full"
        });
        
        if (packagesResponse.objects && packagesResponse.objects.length > 0) {
            let html = '';
            packagesResponse.objects.forEach(pkg => {
                html += `
                    <div class="policy-status">
                        <strong>${pkg.name || 'N/A'}</strong><br>
                        Type: ${pkg.type || 'N/A'}<br>
                        UID: ${pkg.uid || 'N/A'}
                    </div>
                `;
            });
            policyDiv.innerHTML = html;
        } else {
            policyDiv.innerHTML = '<p>No policy packages found.</p>';
        }
        
    } catch (error) {
        console.error('Error:', error);
        gatewayDiv.innerHTML = `<div class="policy-status" style="border-left-color: #e74c3c;">
            <strong>Error:</strong> ${error.message || 'Failed to load data'}<br>
            Make sure you have read permissions to the management server.
        </div>`;
        policyDiv.innerHTML = '<p>Unable to load policy information.</p>';
    }
}

// Helper to call Check Point Management API
async function callManagementAPI(command, data) {
    // In a SmartConsole extension, you would use the SmartConsoleInteractions API
    // For now, we'll use a fetch to the management server via the extension context
    // This is simplified - the actual implementation depends on the extension SDK
    
    return new Promise((resolve, reject) => {
        // The SmartConsole extension SDK provides methods to query the management server
        // Since we're not sure of the exact SDK version, we'll provide a note
        console.log(`API Call would be: ${command}`, data);
        
        // For demonstration, return mock data
        if (command === "show-simple-gateways") {
            resolve({
                objects: [
                    { name: "Gateway-1", type: "gateway", version: "R81.20", ipv4_address: "192.168.1.1", uid: "123" },
                    { name: "Gateway-2", type: "gateway", version: "R82", ipv4_address: "192.168.1.2", uid: "456" }
                ]
            });
        } else if (command === "show-packages") {
            resolve({
                objects: [
                    { name: "Standard", type: "policy-package", uid: "pkg1" },
                    { name: "Internet", type: "policy-package", uid: "pkg2" },
                    { name: "DMZ", type: "policy-package", uid: "pkg3" }
                ]
            });
        } else {
            resolve({ objects: [] });
        }
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadGatewayInfo();
    
    document.getElementById('refresh-btn').addEventListener('click', () => {
        loadGatewayInfo();
    });
});
