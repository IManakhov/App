using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;

namespace App.DataLayer.Extension
{
    using System;
    using System.Security.Cryptography;
    using System.Text.RegularExpressions;
    using Newtonsoft.Json;

    /// <summary> Класс общих расширений, используемых по всему проекту </summary>
    public static class CommonExtension
    {
        /// <summary> Получить контрольную сумму файла из потока по алгоритму MD5 </summary>
        public static string GetHashMD5(this System.IO.Stream stream)
        {
            using (MD5 md5 = System.Security.Cryptography.MD5.Create())
            {
                byte[] hashByteArray = md5.ComputeHash(stream);
                return Convert.ToBase64String(hashByteArray, 0, hashByteArray.Length, Base64FormattingOptions.None);
            }
        }

        public static string JsonSerialize(this object entity)
        {
            JsonSerializerSettings settings = new JsonSerializerSettings();
            //settings.ContractResolver = new ShouldSerializeContractResolver();
            settings.DefaultValueHandling = DefaultValueHandling.Ignore;
            settings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            return Newtonsoft.Json.JsonConvert.SerializeObject(entity, settings);
        }

        /// <summary> Пароль для отображения по умолчанию </summary>
        public static string PasswordStrindForDisplay { get; } = "********";

        /// <summary> Валидация пароля </summary>
        public static bool IsPasswordValid(string password)
        {
            if (string.IsNullOrEmpty(password))
                return false;
            if (password.Length < 8)
                return false;
            if (Regex.IsMatch(password, "^[a-z A-Z0-9._,-]+$") == false)
                return false;

            return true;
        }

        /// <summary> Получить зашифрованный пароль(hash) из незашифрованного пароля </summary>
        public static string EncryptPassword(string password)
        {
            char[] chars = password.ToCharArray();
            byte[] data = new byte[chars.Length];

            for (int i = 0; i < data.Length; i++)
            {
                data[i] = (byte)chars[i];
            }
            MD5 md5 = new MD5CryptoServiceProvider();
            byte[] hashByteArray = md5.ComputeHash(data);

            string hash = Convert.ToBase64String(hashByteArray, 0, hashByteArray.Length, Base64FormattingOptions.None);
            return hash;
        }

        public static string[] Split(string str, params char[] separator)
        {
            if (str == null)
                return new string[0];

            return str.Split(separator);
        }


        /// <summary> Получить значение Name из DisplayAttribute перечисления </summary>
        public static string GetDisplayAttributeName(this Enum enumValue)
        {
            MemberInfo[] memberInfoArray = enumValue.GetType().GetMember(enumValue.ToString());
            if (memberInfoArray.Any() == false)
            {
                throw new Exception("Проверь значения перечиcления на клиенте, сервере и БД, а также наличие DisplayAttribute");
            }
            string name = memberInfoArray.First().GetCustomAttribute<DisplayAttribute>().Name;
            return name;
        }
    }
}