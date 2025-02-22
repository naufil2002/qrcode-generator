import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./index.css"; // Import the CSS file

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    item: "",
    message: "If you find my item, please return it. I will give you blessings and a reward!",
  });
  const [qrCode, setQrCode] = useState("");
  const [error, setError] = useState("");
  const qrRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name" && /[^a-zA-Z\s]/.test(value)) return;
    if (name === "phone" && /[^0-9]/.test(value)) return;
    if (name === "phone" && value.length > 10) return;

    setFormData({ ...formData, [name]: value });
  };

  const handleGenerateQR = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.item) {
      return setError("All fields are required!");
    }

    setError("");

    const message = `Hello, I found an item!\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nAddress: ${formData.address}\nItem: ${formData.item}\n\n"${formData.message}"`;

    const whatsappLink = `https://wa.me/9834070695?text=${encodeURIComponent(message)}`;

    setQrCode(whatsappLink);

    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      item: "",
      message: "If you find my item, please return it. I will give you blessings and a reward!",
    });
  };

  const handlePrint = () => {
    if (qrRef.current) {
      const printWindow = window.open("", "_blank");
      printWindow.document.write("<html><head><title>Print QR Code</title></head><body>");
      printWindow.document.write(qrRef.current.outerHTML);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Lost Item QR Code",
          text: "Scan this QR to get the owner's details and contact them via WhatsApp or call!",
          url: qrCode,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      alert("Sharing not supported on this device.");
    }
  };

  return (
    <div className="container">
      <h2>QR Code Generator</h2>
      {error && <p className="error">{error}</p>}

      <div className="input-group">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      </div>
      <div className="input-group">
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      </div>
      <div className="input-group">
        <input type="text" name="phone" placeholder="Phone (10 digits)" value={formData.phone} onChange={handleChange} maxLength="10" required />
      </div>
      <div className="input-group">
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
      </div>
      <div className="input-group">
        <input type="text" name="item" placeholder="Item" value={formData.item} onChange={handleChange} required />
      </div>
      <div className="input-group">
        <input type="text" name="message" placeholder="Message to Finder" value={formData.message} onChange={handleChange} required />
      </div>

      <button onClick={handleGenerateQR} className="generate">Generate QR Code</button>

      {qrCode && (
        <div className="qr-container">
          <div ref={qrRef}>
            <QRCodeCanvas value={qrCode} size={200} />
          </div>
          <p>Scan this QR code to get the owner's details and contact them via WhatsApp or call.</p>
          <div className="btn-group">
            <button onClick={handlePrint} className="print">Print QR Code</button>
            <button onClick={handleShare} className="share">Share QR Code</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
