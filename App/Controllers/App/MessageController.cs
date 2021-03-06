﻿namespace App.Controllers.Core
{
    using App.DTO.Core;
    using App.Models.Core;
    using System.Linq;
    using System.Web.Mvc;
    using App.DataLayer.Extension;
    using DataLayer.DataService.Implementation;
    using System.Collections.Generic;
    using System;
    using App.Models.App;

    public class MessageController : BaseCrudViewController<Message, MessageDTO>
    {
    }
}