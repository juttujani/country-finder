import { useState } from "react";
import "./App.css"; // 🟢 Import the CSS file

function App() {
  const [countryname, setcountryname] = useState("");
  const [countrydata, setcountrydata] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCountries = async (value) => {
    if (!value) {
      setError("Please enter a country name");
      return;
    }

    setLoading(true);
    setError("");
    setcountrydata([]);

    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${value}`
      );
      if (!response.ok) throw new Error("Country not found");

      const data = await response.json();
      setcountrydata(data);
      setcountryname("");
    } catch (error) {
      setError(error.message);
      setcountryname("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h2 className="title">🌍 Country Finder</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter country name"
          value={countryname}
          onChange={(e) => setcountryname(e.target.value)}
        />
        <button onClick={() => fetchCountries(countryname)}>Search</button>
      </div>

      {loading && (
        <p className="loading">
          <img src="loading.png" alt="Loading" width="50px" />
        </p>
      )}

      {error && <p className="error">{error}</p>}

      <div className="countries-container">
        {countrydata.length > 0 &&
          countrydata.map((country) => {
            const currencyKey = Object.keys(country.currencies)[0];
            const currency = country.currencies[currencyKey];

            return (
              <div className="country-card" key={country.name.common}>
                <img src={country.flags.png} alt="flag" className="flag" />
                <h3>{country.name.common}</h3>
                <div className="info-row">
                  <span>
                    <strong>Region:</strong> {country.region}
                  </span>
                  <span>
                    <strong>Capital:</strong>{" "}
                    {country.capital ? country.capital[0] : "N/A"}
                  </span>
                </div>

                <div className="info-row">
                  <span>
                    <strong>Population:</strong>{" "}
                    {country.population.toLocaleString()}
                  </span>
                  <span>
                    <strong>Currency:</strong> {currency.name} (
                    {currency.symbol})
                  </span>
                </div>

                <div className="info-row full">
                  <span>
                    <strong>Languages:</strong>{" "}
                    {Object.values(country.languages).join(", ")}
                  </span>
                </div>

                <a
                  href={country.maps.googleMaps}
                  target="_blank"
                  rel="noreferrer">
                  🌐 View on Google Maps
                </a>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
