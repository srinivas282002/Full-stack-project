import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState([]);
  const [region, setRegion] = useState("All");
  const [loading, setLoading] = useState(false);
  const [sortDesc, setSortDesc] = useState(false);
  const [error, setError] = useState(null);

  const regionColors = {
    Africa: "linear-gradient(135deg, #FFD700, #FFA500)",
    Americas: "linear-gradient(135deg, #4169E1, #1E90FF)",
    Asia: "linear-gradient(135deg, #FF6347, #FF4500)",
    Europe: "linear-gradient(135deg, #9370DB, #8A2BE2)",
    Oceania: "linear-gradient(135deg, #3CB371, #2E8B57)",
    default: "linear-gradient(135deg, #E0E0E0, #B0B0B0)"
  };

  const searchCountries = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://restcountries.com/v3.1/name/${query}`);
      if (!res.ok) throw new Error("Country not found");
      const data = await res.json();
      setCountries(data);
    } catch (error) {
      console.error("Error fetching country data:", error);
      setCountries([]);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = countries
    .filter((country) => (region === "All" ? true : country.region === region))
    .sort((a, b) =>
      sortDesc ? b.population - a.population : a.population - b.population
    );

  const getRegionColor = (region) => {
    return regionColors[region] || regionColors.default;
  };

  const getCountryImage = (countryName, capital) => {
    const searchTerms = [
      `${countryName} landscape`,
      `${countryName} city`,
      `${capital} city`,
      `${countryName}`,
      "beautiful landscape"
    ];
    
    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    return `https://source.unsplash.com/600x400/?${encodeURIComponent(randomTerm)}`;
  };

  return (
    <div className="min-vh-100" style={{ background: "#f8f9fa", paddingBottom: "50px" }}>
      <div className="container pt-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3" style={{ color: "#343a40" }}>
            🌍 Travel Destination Explorer
          </h1>
        </div>

        <div className="row justify-content-center mb-4">
          <div className="col-md-8">
            <div className="input-group shadow-sm">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter a country name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchCountries()}
              />
              <button className="btn btn-primary btn-lg" onClick={searchCountries}>
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <label className="form-label fw-bold">Filter by Region:</label>
                <select
                  className="form-select"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  <option>All</option>
                  <option>Africa</option>
                  <option>Americas</option>
                  <option>Asia</option>
                  <option>Europe</option>
                  <option>Oceania</option>
                </select>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <label className="form-label fw-bold">Sort Options:</label>
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="sortCheckbox"
                    checked={sortDesc}
                    onChange={() => setSortDesc(!sortDesc)}
                  />
                  <label className="form-check-label" htmlFor="sortCheckbox">
                    Sort Population (High to Low)
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger text-center shadow-sm">
            {error} - Please try another search term
          </div>
        )}

        {loading && (
          <div className="text-center my-5 py-5">
            <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status" />
          </div>
        )}

        <div className="row g-4">
          {!loading && filtered.length === 0 && !error && (
            <div className="col-12 text-center py-5">
              <div className="card shadow-sm">
                <div className="card-body py-5">
                  <h5 className="text-muted">No results yet</h5>
                  <p className="text-muted">Search for a country to begin exploring</p>
                </div>
              </div>
            </div>
          )}

          {filtered.map((country) => {
            const name = country.name?.common || "Unknown";
            const flag = country.flags?.png || country.flags?.svg;
            const capital = country.capital?.[0] || "N/A";
            const countryRegion = country.region;
            const population = country.population?.toLocaleString() || "N/A";
            const currency = country.currencies ? Object.values(country.currencies)[0]?.name : "N/A";
            const languages = country.languages ? Object.values(country.languages).join(", ") : "N/A";
            const timezone = country.timezones?.[0] || "N/A";

            const countryImage = getCountryImage(name, capital);

            return (
              <div className="col-md-4" key={country.cca3}>
                <div className="card h-100 shadow-lg border-0 overflow-hidden">
                  <div className="card-img-top position-relative" style={{ height: "200px", overflow: "hidden" }}>
                    <img
                      src={countryImage}
                      className="w-100 h-100"
                      alt={`${name} landscape`}
                      style={{ objectFit: "cover" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80";
                      }}
                    />
                    <div className="position-absolute top-0 end-0 m-2 bg-white rounded p-1">
                      <img 
                        src={flag} 
                        alt={`${name} flag`} 
                        style={{ height: "20px", width: "auto" }} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/30x20?text=Flag";
                        }}
                      />
                    </div>
                  </div>

                  <div 
                    className="card-body"
                    style={{ background: getRegionColor(countryRegion), color: "#fff" }}
                  >
                    <h5 className="card-title fw-bold mb-3">{name}</h5>
                    <div className="card-text">
                      <p className="mb-1"><strong>Capital:</strong> {capital}</p>
                      <p className="mb-1"><strong>Region:</strong> {countryRegion}</p>
                      <p className="mb-1"><strong>Population:</strong> {population}</p>
                      <p className="mb-1"><strong>Currency:</strong> {currency}</p>
                      <p className="mb-1"><strong>Languages:</strong> {languages}</p>
                      <p className="mb-3"><strong>Timezone:</strong> {timezone}</p>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/${name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-light btn-sm mt-2"
                    >
                      View on Map
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;