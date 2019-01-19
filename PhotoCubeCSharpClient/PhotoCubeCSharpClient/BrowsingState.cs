using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoCubeCSharpClient
{
    public class BrowsingState
    {
        public Axis xAxis { get; set; }
        public Axis yAxis { get; set; }
        public Axis zAxis { get; set; }

        public void Print()
        {
            Console.WriteLine("x-axis.Label: " + xAxis.Label);
            Console.Write("x-axis.Values: ");
            foreach(string value in xAxis.Values)
            {
                Console.Write(value + ", ");
            }
        }
    }
}
