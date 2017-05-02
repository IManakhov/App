namespace App.Map.AutoMapperMap
{
    using System;
    using App.DTO.Core;
    using AutoMapper;
    using App.Controllers.Core;
    using App.Models.Core;
    using App.Models.App;

    /// <summary> Provides a named configuration for maps. Naming conventions become scoped per profile. </summary>
    public class CustomProfile : Profile
    {
        public CustomProfile() : base(nameof(CustomProfile)) { }

        [Obsolete("Create a constructor and configure inside of your profile\'s constructor instead. Will be removed in 6.0")]
        protected override void Configure()
        {
            //Объект имущества
            CreateMap<RegisterView, OperatorDTO>()
                //View to DTO 
                .ForMember(dto => dto.Id, option => option.Ignore())
                .ForMember(dto => dto.IsLastVersion, option => option.Ignore())
                .ForMember(dto => dto.Roles, option => option.Ignore())
                .ForMember(dto => dto.RolesStr, option => option.Ignore())
                .ForMember(dto => dto.Status, option => option.Ignore())
                .ForMember(dto => dto.UserId, option => option.Ignore())
                .ForMember(dto => dto.Status, option => option.MapFrom(x => OperatorStatus.Активный))
                .ReverseMap()
                //View to DTO
                .ForMember(viewmodel => viewmodel.PasswordRepeat, option => option.Ignore());


            //Объект имущества
            CreateMap<PaymentTransfer, PaymentTransferDTO>()
                //View to DTO 
                .ForMember(dto => dto.OperatorFrom, option => option.MapFrom(f => new HasIdNameDTO() { Id = f.OperatorFrom.Id, Name = f.OperatorFrom.Name }))
                .ForMember(dto => dto.OperatorTo, option => option.MapFrom(f => new HasIdNameDTO() { Id = f.OperatorTo.Id, Name = f.OperatorTo.Name }))
                .ForMember(dto => dto.PaymentFrom, option => option.MapFrom(f => f.PaymentFrom != null ? new HasIdNameDTO() { Id = f.PaymentFrom.Id } : null))
                .ForMember(dto => dto.PaymentTo, option => option.MapFrom(f => f.PaymentTo != null ?  new HasIdNameDTO() { Id = f.PaymentTo.Id } : null))
                .ForMember(dto => dto.Text, option => option.Ignore())
                .ReverseMap()
                .ForMember(model => model.OperatorFromId, option => option.MapFrom(f => f.OperatorFrom.Id))
                .ForMember(model => model.OperatorToId, option => option.MapFrom(f => f.OperatorTo.Id))
                .ForMember(model => model.PaymentFromId, option => option.MapFrom(f => f.PaymentFrom != null ? (long?)f.PaymentFrom.Id : null))
                .ForMember(model => model.PaymentToId, option => option.MapFrom(f => f.PaymentTo != null ? (long?)f.PaymentTo.Id : null))
                .ForMember(model => model.OperatorFrom, option => option.Ignore())
                .ForMember(model => model.OperatorTo, option => option.Ignore())
                .ForMember(model => model.PaymentFrom, option => option.Ignore())
                .ForMember(model => model.PaymentTo, option => option.Ignore());
        }
    }
}