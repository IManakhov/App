namespace App.DataLayer.Extension.Export
{
    using App.Models.Core;

    public class ExportListToCSV<T> : IExportListToCSV<T> where T : BaseEntity
    {
        /*
        public FileStreamResult Export(IDataViewModel<T> viewModel, IDomainService<T> domainService, BaseParams baseParams)
        {
            var dataResult = viewModel.GetMethodData(baseParams, domainService);
            var title = baseParams.Params["title"].ToString();
            var strBuilding = new StringBuilder();
            var columnModel = JsonConvert.DeserializeObject<List<ExportColumnModel>>(baseParams.Params["columnModel"].ToString());

            var emptySummaryData = new Dictionary<string, int>();
            var summaryStringBuilder = new StringBuilder();
            var summaryData = dataResult.summaryData;
            if (summaryData != null)
            {
                foreach (var column in columnModel)
                {
                    PropertyInfo prop = summaryData.GetType().GetProperty(column.dataIndex);
                    if (column.text.ToLower().Contains("id"))
                    {
                        summaryStringBuilder.Append("Итого");
                    }
                    else
                    {
                        if (prop != null)
                        {
                            var propVal = prop.GetValue(summaryData);
                            if (propVal != null)
                            {
                                var propValue = propVal.ToString();
                                if (propValue == "0")
                                {
                                    emptySummaryData.Add(column.dataIndex, 0);
                                    continue;
                                }
                                summaryStringBuilder.Append(propValue);
                            }
                        }
                    }
                    summaryStringBuilder.Append(";");
                }
            }

            foreach (var column in columnModel)
            {
                if (!emptySummaryData.ContainsKey(column.dataIndex))
                    strBuilding.Append(column.text + ";");
            }
            strBuilding.Append("\n");

            var itemCount = 1;
            foreach (var item in dataResult.data)
            {
                var type = item.GetType();
                foreach (var column in columnModel)
                {
                    if (emptySummaryData.ContainsKey(column.dataIndex))
                        continue;
                    var columnRf = type.GetProperty(column.dataIndex) as PropertyInfo;

                    if (columnRf != null)
                    {
                        var columnValue = columnRf.GetValue(item, null);
                        if (column.text == "ID заявки" && columnValue != null && columnValue == -5)
                        {
                            strBuilding.Append("Итог (склад)");
                        }
                        else
                        {
                            strBuilding.Append((columnValue != null ? columnValue.ToString() : string.Empty));
                        }
                    }
                    else if (column.text == "№")
                    {
                        strBuilding.Append(itemCount);
                    }
                    strBuilding.Append(";");
                }
                itemCount++;
                strBuilding.Append("\n");
            }
            strBuilding.Append(summaryStringBuilder);
            var file = Encoding.UTF8.GetBytes(strBuilding.ToString());
            var resultReturn = new FileStreamResult(new MemoryStream(Encoding.UTF8.GetPreamble().Concat(file).ToArray()), "text/csv; charset=utf-8");
            resultReturn.FileStream.Seek(0, SeekOrigin.Begin);
            resultReturn.FileDownloadName = string.Format("{0}_{1}_{2}.csv", "Система_Родник", title,DateTime.Now.ToString("dd_MM_yyyy_HH_mm"));
            return resultReturn;
        }
    }

    class ExportColumnModel
    {
        public string text { get; set; }
        public string dataIndex { get; set; }
    }*/
    }
}