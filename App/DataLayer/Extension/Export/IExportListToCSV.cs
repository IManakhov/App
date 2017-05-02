namespace App.DataLayer.Extension.Export
{
    using App.Models.Core;

    /// <summary> Сервис экспорта ViewModel в CSV </summary>
    public interface IExportListToCSV<T> where T : BaseEntity
    {
        //FileStreamResult Export(IDataViewModel<T> viewModel, IDomainService<T> domainService, BaseParams baseParams);
    }
}