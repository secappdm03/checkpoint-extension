// SmartConsole Extension: Appliance Information Viewer
// This extension displays gateway information and current policy status

import SmartConsoleInteractions from 'smart-console-interactions';

class ApplianceInfoExtension {
    constructor() {
        this.interactions = new SmartConsoleInteractions();
        this.context = null;
    }

    async init() {
        // Get the current context (which gateway is selected)
        this.context = await this.interactions.getContextObject();
        console.log('Extension initialized with context:', this.context);
        
        this.createUI();
        await this.loadGatewayInfo();
    }

    createUI() {
        // Create the extension window content
        const container = document.createElement('div');
        container.className = 'appliance-info-container';
        container.innerHTML = `
            <style>
                .info-section {
                    margin: 10px 0;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }
                .info-section h3 {
                    margin-top: 0;
                    color: #2c3e50;
                }
                .policy-status {
                    font-family: monospace;
                    background: #f5f5f5;
                    padding: 10px;
                    border-radius: 4px;
                    overflow-x: auto;
                }
                .loading {
                    color: #7f8c8d;
                    font-style: italic;
                }
                .error {
                    color: #e74c3c;
                }
                .success {
                    color: #27ae60;
                }
            </style>
            <div id="appliance-info">
                <div class="loading">Loading appliance information...</div>
            </div>
            <button id="refresh-btn" style="margin-top: 10px;">Refresh Information</button>
        `;
        
        document.body.appendChild(container);
        
        document.getElementById('refresh-btn').addEventListener('click', () => {
            this.loadGatewayInfo();
        });
    }

    async loadGatewayInfo() {
        const infoContainer = document.getElementById('appliance-info');
        infoContainer.innerHTML = '<div class="loading">Loading appliance information...</div>';
        
        try {
            // Query the Management API to get gateway details
            const gatewayQuery = {
                "from": 1,
                "to": 10,
                "filter": `name:"${this.context.name}"`
            };
            
            // Get gateway object information
            const gatewayResult = await this.interactions.query("show-simple-gateway", gatewayQuery);
            const gateway = gatewayResult.objects[0];
            
            // Get installed policy information
            const policyQuery = {
                "from": 1,
                "to": 10,
                "filter": `gateway:"${this.context.uid}"`
            };
            
            const policyResult = await this.interactions.query("show-installed-policies", policyQuery);
            
            // Build the HTML display
            let html = `
                <div class="info-section">
                    <h3>📡 Gateway Information</h3>
                    <p><strong>Name:</strong> ${gateway.name || 'N/A'}</p>
                    <p><strong>UID:</strong> ${gateway.uid || 'N/A'}</p>
                    <p><strong>IPv4 Address:</strong> ${gateway.ipv4_address || 'N/A'}</p>
                    <p><strong>Version:</strong> ${gateway.version || 'N/A'}</p>
                    <p><strong>OS:</strong> ${gateway.os_name || 'N/A'}</p>
                </div>
                
                <div class="info-section">
                    <h3>🔒 Current Security Policy</h3>
            `;
            
            if (policyResult.objects && policyResult.objects.length > 0) {
                policyResult.objects.forEach(policy => {
                    html += `
                        <div class="policy-status">
                            <strong>Policy Name:</strong> ${policy.name}<br>
                            <strong>Installed On:</strong> ${policy.installed_on || 'N/A'}<br>
                            <strong>Installed By:</strong> ${policy.installed_by || 'N/A'}<br>
                            <strong>Installation Time:</strong> ${policy.installation_time || 'N/A'}
                        </div>
                    `;
                });
            } else {
                html += `<p>No policy information available. You can check via CLI: <code>fw stat</code></p>`;
            }
            
            html += `</div>`;
            
            // Add information about active connections
            html += `
                <div class="info-section">
                    <h3>📊 Active Connections Summary</h3>
                    <p>To view detailed connection information, you can use the "Execute Commands" extension with:</p>
                    <pre><code>fw tab -t connections -s</code></pre>
                    <p>Or for detailed policy view:</p>
                    <pre><code>fw stat</code></pre>
                </div>
            `;
            
            infoContainer.innerHTML = html;
            
        } catch (error) {
            console.error('Error loading gateway info:', error);
            infoContainer.innerHTML = `
                <div class="error">
                    <strong>Error loading information:</strong><br>
                    ${error.message}<br><br>
                    <strong>Alternative commands you can run via CLI:</strong><br>
                    <code>fw stat</code> - Show installed policy<br>
                    <code>cphaprob stat</code> - Show cluster status<br>
                    <code>show version all</code> - Show system version
                </div>
            `;
        }
    }
}

// Initialize the extension when loaded
window.addEventListener('DOMContentLoaded', () => {
    const extension = new ApplianceInfoExtension();
    extension.init();
});