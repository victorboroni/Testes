import { setCssVar } from "quasar";

const color = () => {
  setCssVar("primary", "#FD0267");
  setCssVar("primary-dark", "#5B2EEE");
  setCssVar("primary-light", "#F5A3AC");
  setCssVar("primary-lightest", "#FDECEE");
  setCssVar("info", "#8D99AE");
  setCssVar("info-dark", "#494C6F");
  setCssVar("info-darkest", "#2B2D42");
  setCssVar("info-light", "#E6ECEF");
  setCssVar("info-lightest", "#F3F6F7");
  setCssVar("warning", "#FFB300");
  setCssVar("highlight-danger", "#EA1D2C");
  setCssVar("highlight-warning", "#EDB900");
  setCssVar("highlight-info", "#00AB6C");
  setCssVar("disabled", "#C5CFE1");
};
export default color;
