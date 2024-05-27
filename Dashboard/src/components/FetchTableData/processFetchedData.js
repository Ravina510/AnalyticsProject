
export const processFetchedData = (data) => {
    const list = data || [];
    const result = {
      columns: [],
      dataSource: [],
    };
  
    if (list.length > 0) {
      const firstObject = list[0] || {};
      const cols = [];
      for (const key in firstObject) {
        const col = {
          title: key,
          dataIndex: key,
          header: key,
          accessorKey: key,
          headerStyle: {
            backgroundColor: "#378FC3",
            color: "#FFF",
            fontSize: "17px",
            textAlign: "center",
            fontWeight: "bold",
          },
        };
        if (typeof firstObject[key] === "number") {
          col.filterVariant = "range";
          col.filterFn = "between";
          col.size = 80;
        }
        cols.push(col);
      }
      result.columns = cols;
      result.dataSource = list;
    }
  
    return result;
  };
  