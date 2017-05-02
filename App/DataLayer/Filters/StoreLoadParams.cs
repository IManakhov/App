namespace App.DataLayer.Filters
{
    using System.Collections.Generic;
    using Newtonsoft.Json;
    using App.DataLayer.Extension;

    public class StoreLoadParams
    {
        public int start { get; set; }
        public int limit { get; set; }
        public List<FilterColumn> filter { get; set; }
        public List<OrderColumn> sort { get; set; }

        public StoreLoadParams(int start, int limit, string filter, string sort)
        {
            this.start = start;
            this.limit = limit;
            this.filter = string.IsNullOrEmpty(filter) ? new List<FilterColumn>() : JsonConvert.DeserializeObject<List<FilterColumn>>(filter);
            this.sort = string.IsNullOrEmpty(sort) ? new List<OrderColumn>() : JsonConvert.DeserializeObject<List<OrderColumn>>(sort);
        }
    }
}