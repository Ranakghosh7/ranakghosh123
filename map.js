// ================== TRAVEL MAP ==================
(function () {
  const ROME = [41.8536, 12.6045];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- EDIT ME: your places. type = "visited" | "wishlist" | "lived" ----
  const PLACES = [
    // lived
    { name: "Agartala, India",             coords: [23.8315, 91.2868],  type: "lived",   note: "hometown" },
    { name: "Holy Cross School, Agartala", coords: [23.8340, 91.2810],  type: "lived",   note: "school days" },
    // visited
    { name: "Lago di Bracciano",  coords: [42.1167, 12.2333], type: "visited" },
    { name: "Lago del Salto",     coords: [42.1870, 13.0300], type: "visited" },
    { name: "Lago del Turano",    coords: [42.1850, 12.9650], type: "visited" },
    { name: "Lago di Albano",     coords: [41.7480, 12.6670], type: "visited" },
    { name: "Monte Felice",       coords: [42.0200, 13.1000], type: "visited" },
    { name: "Monteflavio",        coords: [42.1130, 12.8700], type: "visited" },
    { name: "Rifugio la Vecchia", coords: [42.2100, 13.2500], type: "visited" },
    { name: "Campo Felice",       coords: [42.2200, 13.3300], type: "visited" },
    { name: "Campocatino",        coords: [41.8300, 13.4200], type: "visited" },
    { name: "Saturnia",           coords: [42.6600, 11.5000], type: "visited", note: "hot springs" },
    { name: "Venice",             coords: [45.4408, 12.3155], type: "visited" },
    { name: "Salerno",            coords: [40.6824, 14.7681], type: "visited" },
    { name: "Amalfi",             coords: [40.6340, 14.6020], type: "visited" },
    { name: "Positano",           coords: [40.6280, 14.4850], type: "visited" },
    // want to visit
    { name: "Barcelona, Spain",   coords: [41.3874, 2.1686],   type: "wishlist" },
    { name: "Paris, France",      coords: [48.8566, 2.3522],   type: "wishlist" },
    { name: "Prague, Czechia",    coords: [50.0755, 14.4378],  type: "wishlist" },
    { name: "Tokyo, Japan",       coords: [35.6762, 139.6503], type: "wishlist", note: "someday" }
  ];
  // -----------------------------------------------------------------------

  const map = L.map("worldMap", {
    zoomControl: true, scrollWheelZoom: true,
    minZoom: 2, maxZoom: 9, worldCopyJump: true,
    maxBounds: [[-85, -200], [85, 200]], maxBoundsViscosity: 0.7
  }).setView([30, 30], 2);

  // --- Basemap: clean vector countries from a CDN; tiles as a fallback ---
  const WORLD_URL =
    "https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@v5.1.2/geojson/ne_110m_admin_0_countries.geojson";

  fetch(WORLD_URL)
    .then(r => { if (!r.ok) throw new Error("geojson " + r.status); return r.json(); })
    .then(geo => {
      L.geoJSON(geo, {
        style: { fillColor: "#dfe4e7", fillOpacity: 1, color: "#c4ccd1", weight: 0.7 },
        interactive: false
      }).addTo(map);
    })
    .catch(() => {
      // Fallback: light raster tiles if the CDN is unreachable
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19
      }).addTo(map);
    });

  L.control.attribution({ prefix: false }).addTo(map);
  map.attributionControl.addAttribution("Natural Earth");

  // Home glow marker
  const homeIcon = L.divIcon({
    className: "home-glow",
    html: `<div class="halo${reduceMotion ? "" : " pulse"}"></div><div class="core"></div>`,
    iconSize: [46, 46], iconAnchor: [23, 23]
  });
  const home = L.marker(ROME, { icon: homeIcon, zIndexOffset: 1000 }).addTo(map);
  home.bindPopup("<b>Rome, Italy</b><br><span style='color:#27ae60'>home base</span><br>Univ. of Rome Tor Vergata");

  // Diamond pins
  const LABELS = { visited: "visited", wishlist: "want to visit", lived: "lived here" };
  const COLORS = { visited: "#2e86c1", wishlist: "#e84393", lived: "#f39c12" };
  PLACES.forEach(p => {
    const icon = L.divIcon({
      className: "",
      html: `<div class="pin ${p.type}"></div>`,
      iconSize: [12, 12], iconAnchor: [6, 6]
    });
    L.marker(p.coords, { icon }).addTo(map)
      .bindPopup(
        `<b>${p.name}</b><br><span style="color:${COLORS[p.type]}">${LABELS[p.type]}</span>` +
        (p.note ? `<br>${p.note}` : "")
      );
  });

  // Live counter
  const nV = PLACES.filter(p => p.type === "visited").length;
  const nW = PLACES.filter(p => p.type === "wishlist").length;
  const cnt = document.getElementById("tmCount");
  if (cnt) cnt.textContent = `🌍 ${nV} visited · ${nW} on the list`;

  // Intro fly-in
  setTimeout(() => {
    reduceMotion ? map.setView([44, 13], 4) : map.flyTo([44, 13], 4, { duration: 2.2 });
    setTimeout(() => home.openPopup(), reduceMotion ? 200 : 2400);
  }, 700);

  // Recenter link
  document.getElementById("flyHome").addEventListener("click", e => {
    e.preventDefault();
    reduceMotion ? map.setView([44, 13], 4) : map.flyTo([44, 13], 4, { duration: 1.4 });
  });
})();
