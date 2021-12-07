function generateRanges(start, end, step, isInt) {
  const n = Math.round((end - start) / step);
  return [...Array(n).keys()].map((i) => {
    const a = i * step + start;
    return `${a.toFixed(isInt ? 0 : 2)} - ${(a + step).toFixed(isInt ? 0 : 2)}`;
  });
}
function appendFilters(filtersRef) {
  filters.forEach((filter) => {
    if (filter.type === "range") {
      const div = document.createElement("div");
      const label = document.createElement("label");
      label.innerText = filter.label;
      const select = document.createElement("select");
      select.name = filter.field;
      var [mn, mx] = d3.extent(data.map((d) => d[filter.field]));
      mn -= mn % filter.step;
      mx += filter.step - (mx % filter.step);
      const ranges = generateRanges(mn, mx, filter.step, filter.isInt);
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.innerText = "ALL";
      select.appendChild(defaultOption);
      select.append.apply(
        select,
        ranges.map((r) => {
          const option = document.createElement("option");
          option.innerText = r;
          return option;
        })
      );
      div.append(label, select);
      div.className = "filter";
      filtersRef.appendChild(div);
    }
  });
}
function getFormValues() {
  const values = $("#my-form").serializeArray();
  return values.reduce((res, d) => ({ ...res, [d.name]: d.value }), {});
}
function processRange(range, value) {
  if (!range) return true;
  const [a, b] = range.split("-");
  return value >= a && value <= b;
}

function drawChartByYear(year, data, cb, preserveLegends) {
  cb(
    data.filter((d) => d.year === year),
    preserveLegends
  );
}
function filterData(
  drawChartFn,
  options = { customFilter: {}, preserveLegends: false }
) {
  const formValues = { ...getFormValues(), ...options.customFilter };
  var filteredData = data.filter((d) => {
    return filters.every(({ field, type }) =>
      !formValues[field] || type === "range"
        ? processRange(formValues[field], d[field])
        : formValues[field] == d[field]
    );
  });
  drawChartByYear(
    formValues.year,
    filteredData || [],
    drawChartFn,
    options.preserveLegends
  );
}
