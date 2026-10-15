// Production contact delivery stays disabled until a real HTTPS endpoint is added.
// The endpoint should accept JSON POST requests and return a 2xx response only after
// the inquiry has been durably accepted by your form or email service.
window.AM_SITE_CONFIG = Object.freeze({
  basePath: "",
  contactEndpoint: "",
  contactEmail: "",
  companyLegalName: "A&M Tech Solutions",
  jurisdiction: "",
  effectiveDate: ""
});
