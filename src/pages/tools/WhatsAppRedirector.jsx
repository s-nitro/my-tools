import { useState } from "react";

const COUNTRIES = [
  { name: "🇮🇳 India (+91)", code: "91", maxLength: 10 },
  { name: "🇺🇸 USA (+1)", code: "1" },
  { name: "🇬🇧 UK (+44)", code: "44" },
  { name: "🇦🇪 UAE (+971)", code: "971" },
  { name: "🇸🇬 Singapore (+65)", code: "65" },
];

export default function WhatsAppRedirector() {
  const [countryCode, setCountryCode] = useState("91");
  const [phone, setPhone] = useState("");

  function cleanPhone(value, code) {
    let digits = value.replace(/\D/g, "");

    if (code === "91") {
      // +91xxxxxxxxxx or 91xxxxxxxxxx
      if (digits.startsWith("91") && digits.length > 10) {
        digits = digits.slice(2);
      }

      // 09876543210
      if (digits.startsWith("0") && digits.length > 10) {
        digits = digits.slice(1);
      }

      // Keep only last 10 digits
      if (digits.length > 10) {
        digits = digits.slice(-10);
      }
    }

    return digits;
  }

  function handleNumberChange(e) {
    setPhone(cleanPhone(e.target.value, countryCode));
  }

  function handleCountryChange(e) {
    const code = e.target.value;
    setCountryCode(code);
    setPhone(cleanPhone(phone, code));
  }

  function openChat() {
    const cleaned = cleanPhone(phone, countryCode);

    if (!cleaned) {
      alert("Please enter a phone number.");
      return;
    }

    if (countryCode === "91" && cleaned.length !== 10) {
      alert("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    window.open(`https://wa.me/${countryCode}${cleaned}`, "_blank");
  }

  return (
    <div className="tool">
      <h2>WhatsApp Redirector</h2>

      <p>
        Enter a phone number without saving the contact. Spaces, dashes and
        country code are handled automatically.
      </p>

      <div className="wa-form">
        <select
          className="wa-select"
          value={countryCode}
          onChange={handleCountryChange}
        >
          {COUNTRIES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>

        <input
          className="wa-input"
          type="tel"
          inputMode="numeric"
          autoComplete="off"
          placeholder="98765 43210"
          value={phone}
          onChange={handleNumberChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              openChat();
            }
          }}
        />
      </div>

      <button className="wa-btn" onClick={openChat}>
        Open WhatsApp
      </button>
    </div>
  );
}
