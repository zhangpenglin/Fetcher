using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CommandLine;
using CommandLine.Text;
using RTXSAPILib;
namespace ConsoleApplication1
{
    public class Options
    {
        // 短参数名称，长参数名称，是否是可选参数，默认值，帮助文本等
        // 第一个参数-f
        [Option('m', "message", Required = true, HelpText = "message.")]
        public string message { get; set; }

        // 第二个参数-s
        [Option('r', "receiver", DefaultValue = "", HelpText = "receiver.")]
        public string receiver { get; set; }

     

        [ParserState]
        public IParserState LastParserState { get; set; }

        [HelpOption]
        public string GetUsage()
        {
            return HelpText.AutoBuild(this,
              (HelpText current) => HelpText.DefaultParsingErrorsHandler(this, current));
        }
    }
    class Program
    {
        static void Main(string[] args)
        {
            var options = new Options();
            if (CommandLine.Parser.Default.ParseArguments(args, options))
            {
                string message = options.message;
                string receiver = options.receiver;
                Console.WriteLine(message);
                Console.WriteLine(receiver);
                RTXSAPILib.RTXSAPIRootObj RootObj = new RTXSAPIRootObj();
                RootObj.ServerIP = "127.0.0.1"; //设置服务器IP
                RootObj.ServerPort = 8006; //设置服务器端口
                RootObj.SendNotify(receiver, "有新内容", Convert.ToInt32("0"), message); //获取版本信息
            }
        }
    }
}
