using Newtonsoft.Json;
using ObjectCubeServer.Models.DomainClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace PhotoCubeCSharpClient
{
    class Program
    {
        static void Main(string[] args)
        {
            Program p = new Program();
            p.RunAsync();
            Console.ReadKey();
        }

        public async Task RunAsync()
        {
            HttpClient client = new HttpClient();
            HttpResponseMessage response = await client.GetAsync("https://localhost:44317/api/tagset/1");
            string result = await response.Content.ReadAsStringAsync();
            Tagset resultTagset = JsonConvert.DeserializeObject<Tagset>(result);
            

            BrowsingState bs = new BrowsingState();
            bs.xAxis = new Axis();
            bs.xAxis.Label = "Tagset:" + resultTagset.Name;
            bs.xAxis.Values = resultTagset.Tags.OrderBy(t => t.Name).Select(t => t.Name).ToList();
            bs.Print();
        }
    }
}
