import React from "react";

const PaymentPage = () => {
  return (
    <div
      style={{
        fontFamily: "sans-serif",
        display: "flex",
        flexDirection: "column",
        maxWidth: "100%",
        margin: "0 auto",
        border: "1px solid #000",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#d7ceb3",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#41372d",
        }}
      >
        <div>
          <strong>PRICE LOCKED FOR 10 MINS</strong>
          <br />
          <small>Complete your payment soon</small>
        </div>
        <div
          style={{
            background: "#3d2e1e",
            color: "white",
            padding: "6px 12px",
            borderRadius: "20px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          ⏳ 8:49
        </div>
      </div>

      {/* Main Section */}
      <div style={{ display: "flex" }}>
        {/* Left: Payment Method */}
        <div
          style={{
            flex: 2,
            padding: "20px",
            background: "white",
            color: "#41372d",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>SELECT A PAYMENT METHOD</h3>
          <div
            style={{
              background: "#e3ddc5",
              padding: "8px",
              fontWeight: "bold",
            }}
          >
            OTHER PAYMENT OPTIONS
          </div>

          {/* Options */}
          {[
            {
              title: "UPI",
              subtitle: "Google Pay, PhonePe, BHIM UPI",
              icon: "📶",
            },
            {
              title: "CREDIT/ DEBIT/ ATM CARD",
              subtitle:
                "Please ensure your card is enabled for online transactions",
              icon: "💳",
            },
            {
              title: "MOBILE WALLET",
              subtitle: "All wallets are supported",
              icon: "📱",
            },
            {
              title: "NET BANKING",
              subtitle: "All banks are supported",
              icon: "🏦",
            },
          ].map((option, idx) => (
            <div
              key={idx}
              style={{
                borderBottom: "1px solid #ccc",
                padding: "12px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "20px", marginRight: "12px" }}>
                {option.icon}
              </span>
              <div>
                <strong>{option.title}</strong>
                <br />
                <small>{option.subtitle}</small>
              </div>
            </div>
          ))}
        </div>

        {/* Right: QR + Booking Summary */}
        <div
          style={{
            flex: 1.2,
            backgroundColor: "#fff",
            borderLeft: "1px solid #ccc",
            padding: "20px",
          }}
        >
          {/* QR Code Section */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <strong>SCAN QR CODE</strong>
            <div style={{ margin: "10px 0" }}>
              <img
                src="qr.png"
                alt="QR Code"
                style={{ width: "150px", height: "150px" }}
              />
            </div>
            <a
              href="#"
              style={{
                color: "green",
                textDecoration: "underline",
                fontSize: "13px",
              }}
            >
              Click to see QR code
            </a>
            <div style={{ marginTop: "8px", fontSize: "14px" }}>
              GPay | PhonePe | Apple Pay
            </div>
            <button
              style={{
                backgroundColor: "#3d2e1e",
                color: "#fff",
                border: "none",
                padding: "10px 30px",
                borderRadius: "6px",
                marginTop: "10px",
                cursor: "pointer",
              }}
            >
              PAY
            </button>
          </div>

          {/* Booking Details */}
          <div
            style={{
              backgroundColor: "#f3eee4",
              padding: "15px",
              borderRadius: "6px",
              color: "#41372d",
            }}
          >
            <h4 style={{ marginBottom: "8px" }}>BOOKING DETAILS</h4>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong>Baleno 2020</strong>
              <img
                src="/Model1.png"
                alt="Car"
                style={{ width: "80px", height: "auto", borderRadius: "4px" }}
              />
            </div>
            <div style={{ margin: "12px 0", fontSize: "14px" }}>
              <div>• 20/2/25 - 10AM</div>
              <div>• 22/2/25 - 10AM</div>
            </div>
            <div
              style={{
                backgroundColor: "#5b4832",
                color: "#fff",
                padding: "8px",
                textAlign: "center",
                borderRadius: "4px",
                fontWeight: "bold",
              }}
            >
              CANCELLATION UNAVAILABLE
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "15px",
                fontWeight: "bold",
              }}
            >
              <span>TOTAL</span>
              <span>₹2000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
