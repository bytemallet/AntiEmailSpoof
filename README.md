# AntiEmailSpoof 🛡️

AntiEmailSpoof is a simple, user-friendly tool that helps you check if your email domain is properly configured to prevent email spoofing. It analyzes your domain's SPF and DMARC records to assess its security posture against email-based attacks.

## 🌐 Live Demo
Visit [AntiEmailSpoof](https://bytemallet.github.io/AntiEmailSpoof) to try it out!

## ✨ Features
- Real-time domain security checking
- Detailed analysis of SPF and DMARC configurations
- Copyable configuration examples

## 🔍 How It Works
AntiEmailSpoof checks two essential email security protocols:
1. **SPF (Sender Policy Framework)**: Verifies which mail servers are authorized to send emails from your domain
2. **DMARC (Domain-based Message Authentication, Reporting & Conformance)**: Tells receiving mail servers how to handle unauthorized emails

## 🚀 Security Status Levels
The tool provides different status levels based on your domain's configuration:
- ✅ **Secure**: Domain has both SPF and DMARC with reject policy
- 🔸 **Moderate**: Domain has basic protection but uses quarantine policy
- ⚠️ **Warning**: Domain has partial or basic configuration
- ❌ **Vulnerable**: Domain lacks proper email security measures

## 🛠️ Technical Details
- Uses Google's DNS-over-HTTPS API
- Runs entirely in the browser

## 📚 Learn More
- [SPF Record Syntax](https://www.cloudflare.com/learning/dns/dns-records/dns-spf-record/)
- [DMARC Overview](https://dmarc.org/overview/)
- [Email Security Best Practices](https://www.ncsc.gov.uk/collection/email-security-and-anti-spoofing)

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## ☕ Support
If you find this tool useful, you can [buy me a coffee](https://ko-fi.com/bytemallet)!

