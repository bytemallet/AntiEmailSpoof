function isValidDomain(domain) {
    // Regular expression for domain validation
    // Allows domains like example.com, sub.example.com, sub.sub.example.co.uk
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
}

async function checkDomain() {
    const domain = document.getElementById('domainInput').value.trim();
    const resultBox = document.getElementById('resultBox');
    const resultText = document.getElementById('resultText');
    const loader = document.getElementById('loader');

    if (!domain) {
        alert('Please enter a domain');
        return;
    }

    if (!isValidDomain(domain)) {
        resultBox.style.display = 'block';
        resultBox.className = 'result-box danger';
        resultText.innerHTML = '❌ Please enter a valid domain (e.g., example.com)';
        return;
    }

    // Show loader
    resultBox.style.display = 'block';
    loader.style.display = 'block';
    resultText.innerHTML = '';
    resultBox.className = 'result-box';

    try {
        // Check SPF
        const spfResponse = await fetch(`https://dns.google/resolve?name=${domain}&type=TXT`);
        const spfData = await spfResponse.json();
        
        // Check DMARC
        const dmarcResponse = await fetch(`https://dns.google/resolve?name=_dmarc.${domain}&type=TXT`);
        const dmarcData = await dmarcResponse.json();

        let hasSPF = false;
        let hasDMARC = false;
        let dmarcPolicy = '';

        // Parse SPF
        if (spfData.Answer) {
            hasSPF = spfData.Answer.some(record => 
                record.data.includes('v=spf1'));
        }

        // Parse DMARC
        if (dmarcData.Answer) {
            hasDMARC = dmarcData.Answer.some(record => {
                if (record.data.includes('v=DMARC1')) {
                    dmarcPolicy = record.data;
                    return true;
                }
                return false;
            });
        }

        // Determine security level
        let result = '';
        let className = '';
        let details = [];

        // Check what's missing
        if (!hasSPF) {
            details.push("Missing SPF record - Your domain is vulnerable to email spoofing");
        }
        if (!hasDMARC) {
            details.push("Missing DMARC record - Receiving servers don't know how to handle unauthorized emails");
        } else {
            // Check DMARC policy levels
            if (dmarcPolicy.includes('p=reject')) {
                // No warning needed - this is the most secure setting
            } else if (dmarcPolicy.includes('p=quarantine')) {
                details.push("DMARC policy is set to 'quarantine' - Suspicious emails will be sent to spam, but this still allows potential phishing attempts to reach users");
            } else if (dmarcPolicy.includes('p=none')) {
                details.push("DMARC policy is set to 'none' - Only monitoring, no protection against spoofing");
            } else {
                details.push("DMARC record exists but no valid policy found");
            }
        }

        if (hasSPF && hasDMARC) {
            if (dmarcPolicy.includes('p=reject')) {
                result = '✅ Domain is correctly configured and secure against email spoofing ✅';
                className = 'secure';
            } else if (dmarcPolicy.includes('p=quarantine')) {
                result = '🔸 Domain has moderate protection but could be strengthened 🔸';
                className = 'warning';
            } else {
                result = '⚠️ Domain has basic configuration but lacks effective protection ⚠️';
                className = 'warning';
            }
        } else if (hasSPF || hasDMARC) {
            result = '⚠️ Domain is only partially protected - Additional configuration required ⚠️';
            className = 'warning';
        } else {
            result = '❌ Domain is vulnerable to spoofing! No email security measures detected ❌';
            className = 'danger';
        }

        // Show result with details if there are issues
        loader.style.display = 'none';
        resultBox.className = `result-box ${className}`;

        if (details.length > 0) {
            resultText.innerHTML = `
                <div class="main-result">${result}</div>
                <div class="details-list">${details.join('<br>')}</div>
            `;
        } else {
            resultText.innerHTML = `
                <div class="main-result">${result}</div>
            `;
        }

    } catch (error) {
        loader.style.display = 'none';
        resultBox.className = 'result-box danger';
        resultText.innerHTML = '❌ Error checking domain security';
        console.error('Error:', error);
    }
}

// Add enter key support
document.getElementById('domainInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkDomain();
    }
});

// Add input validation while typing
document.getElementById('domainInput').addEventListener('input', function(e) {
    const domain = e.target.value.trim();
    const checkButton = document.getElementById('checkButton');
    
    if (domain && !isValidDomain(domain)) {
        e.target.classList.add('invalid');
        checkButton.disabled = true;
    } else {
        e.target.classList.remove('invalid');
        checkButton.disabled = false;
    }
});

function copyToClipboard(button) {
    const codeElement = button.previousElementSibling;
    const textArea = document.createElement('textarea');
    textArea.value = codeElement.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    // Change button text temporarily
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
        button.style.color = '';
    }, 2000);
} 