//external dependencies
import * as chai from 'chai';
var expect = chai.expect;
import * as statements from '../statements';
describe("Reducers - statements", function() {
  describe('Get paths from statements', function(){
    const testStatements:statements.Statement[] = [
      {subject:'sub', predicate: 'pred', object:'obj'},
      {subject:'sub', predicate: 'pred', object:'objx'},
      {subject:'sub', predicate: 'pred2', object:'obj2'},
      {subject:'obj2', predicate: 'pred3', object:'obj3'},
      {subject:'obj2', predicate: 'pred4', object:'obj4'},
      {subject:'obj4', predicate: 'pred5', object:'obj5'},
    ]
    it('With empty statements list', function() {
      expect(statements.getPaths([], 'sub')).to.have.lengthOf(0)
    })
    it('With iri that doesnt exist', function() {
      expect(statements.getPaths(testStatements, 'sdgdhg')).to.have.lengthOf(0)
    })
    it('With iri that exists', function() {
      const paths = statements.getPaths(testStatements, 'sub');
      expect(paths).to.have.lengthOf(4)
    })
    it('Should not get into loops', function() {
      const loopStatements:statements.Statement[] = [...testStatements, {subject:'obj2', predicate: 'loop', object:'sub'}];
      const paths = statements.getPaths(loopStatements, 'sub');
      expect(paths).to.have.lengthOf(5)
    })
    it('One-off test (skipped by default)', function() {
      const paths = statements.getPaths([
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    "object": "http://www.w3.org/2002/07/owl#Thing",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "http://www.opengis.net/ont/geosparql#hasGeometry",
    "object": "https://data.pdok.nl/cbs/.well-known/genid/c37ac6f6-2a87-11e7-a6fd-0cc47a6be748",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/.well-known/genid/c37ac6f6-2a87-11e7-a6fd-0cc47a6be748",
    "predicate": "http://www.opengis.net/ont/geosparql#asWKT",
    "object": "\"MultiPolygon(((236054.47012849897 559623.0689356998,236060.38602850214 559620.8830357008,236066.6410285011 559621.2530357018,236076.00802849978 559617.959035702,236076.60702849925 559617.6990357004,236082.52302850038 559616.2390356995,236092.02902850136 559629.3870357014,236100.04502850026 559642.5250357017,236108.220028501 559654.8110357001,236119.23802850023 559672.4090357013,236127.6560285017 559685.7370356992,236135.77202850208 559697.6490356997,236143.38702850044 559710.1490356997,236150.08502849936 559720.1430357024,236218.92702849954 559828.3090356998,236220.69202850014 559829.1890357025,236223.31202850118 559830.1360356994,236226.66002849862 559831.2740356997,236229.32602849975 559832.1120356992,236237.64002849907 559833.8380357027,236245.15502849966 559834.2390356995,236256.8680284992 559839.0590356998,236270.1970284991 559843.8890357018,236284.99902850017 559848.913035702,236288.7750285007 559851.2340357006,236290.31202850118 559851.3200356998,236292.3460284993 559851.5650357008,236294.82702850178 559852.1380356997,236301.02702850103 559854.2240357026,236312.8840285018 559858.3470357023,236322.16902850196 559861.5220356993,236334.13002850115 559866.4680357017,236339.34002850205 559870.5520357005,236337.80102850124 559876.1180357002,236336.651028499 559881.7490357012,236336.29902850091 559888.7830356993,236335.6420284994 559897.709035702,236335.46302850172 559904.4480357021,236378.7110285014 559897.3060357012,236402.7430284992 559893.5630357005,236404.8140285015 559892.5660356991,236410.62802850083 559891.5900356993,236417.28402850032 559890.1530357003,236419.91202849895 559889.5780357011,236428.3680284992 559888.2910357006,236430.70002850145 559887.9170357026,236435.94102850184 559886.5490357019,236437.09402849898 559883.1830357015,236437.1713284999 559879.6680357009,236440.53502849862 559879.7420357019,236441.03502849862 559880.0790356994,236442.41802849993 559881.1400357,236445.13762849942 559881.1816357002,236459.42802850157 559881.4000357017,236459.36402850226 559881.282035701,236468.73402849957 559881.3070356995,236468.720028501 559881.5250357017,236481.74442850053 559881.7086357027,236481.80202849954 559876.3970356993,236485.8910285011 559500.0000356995,236487.101028502 559388.595035702,236487.220028501 559378.1070357002,236487.78402850032 559335.2990357019,236486.37302850187 559292.0910357013,236483.01202850044 559249.8670357019,236478.10702849925 559215.3020357005,236473.8460284993 559188.5570356995,236465.45102849975 559150.5390357003,236456.80002849922 559118.2500356995,236455.7473285012 559114.8506356999,236455.1250285022 559114.9840357006,236451.54402850196 559116.0650357008,236446.06802850217 559117.8600357026,236446.28702849895 559119.5650357008,236442.32702850178 559120.6010356992,236441.63002850115 559118.7550357021,236433.91002849862 559120.9740357026,236433.9150285013 559121.3510356992,236433.8370284997 559121.6150357015,236433.726028502 559121.9780356996,236433.5320285 559122.1610357016,236433.28702849895 559122.3120357022,236433.07502850145 559122.3470357023,236432.64802850038 559122.3530356996,236432.33802850172 559122.5050357021,236432.04302849993 559122.5250357017,236431.81202850118 559122.4950357005,236431.72502849996 559122.1020357013,236422.98902850226 559124.4650356993,236419.6810285002 559125.520035699,236418.7335285023 559126.0791357011,236417.88482850045 559126.7790357023,236417.15562849864 559127.6028356999,236416.56382850185 559128.5302357003,236416.1238285005 559129.5385356992,236415.84652850032 559130.6031357013,236415.73852850124 559131.6979357004,236415.80252850056 559132.7961357012,236416.03702849895 559133.8710357025,236413.97302849963 559134.4420357011,236413.74702849984 559132.4660357013,236413.7488285005 559130.9559357017,236414.01022849977 559129.4687357023,236414.5234284997 559128.0486357026,236415.27312850207 559126.7378357016,236416.23702850193 559125.5755356997,236417.38642850146 559124.596135702,236418.68702850118 559123.8290356994,236418.57302850112 559123.5230357014,236417.0410284996 559123.657035701,236415.14562850073 559123.7240357026,236413.25802849978 559123.5400357023,236411.00512849912 559122.9491357021,236408.86662850156 559122.026535701,236406.8910285011 559120.7930357009,236405.42772850022 559119.5757356994,236404.1260285005 559118.1870357022,236403.1570285 559114.8370357007,236396.6570285 559093.1620356999,236394.05102850124 559085.4370357022,236390.32492849976 559073.8157357015,236386.34802849963 559062.2780357003,236384.97802850232 559058.9749356993,236383.38202850148 559055.7750357017,236381.9210285023 559053.2230357006,236380.80402849987 559051.7460357025,236379.48902850226 559050.202035699,236377.87402850017 559048.4460357018,236377.20702850074 559047.7298357002,236376.4311285019 559047.1333357021,236375.56752850115 559046.6728357002,236374.6399285011 559046.3609356992,236373.6735284999 559046.2060356997,236372.6949285008 559046.2125357017,236371.7307284996 559046.3801357001,236370.80732849985 559046.7043357007,236369.94992849976 559047.1762357019,236369.18202850223 559047.7830356993,236367.89062850177 559048.652635701,236366.48852850124 559049.329235699,236365.00412850082 559049.7988357022,236363.46802850068 559050.0520357005,236360.34902850166 559050.8240357004,236356.79902850091 559051.6700357012,236346.17122850195 559053.5524356999,236335.45892849937 559054.8722357005,236324.69202850014 559055.6257357001,236313.90042850003 559055.8108357005,236303.11402850226 559055.4270357005,236285.5870284997 559054.6090357006,236269.4070285 559053.538035702,236176.48902850226 559047.1820356995,236154.96122850105 559045.5190357007,236133.47202850133 559043.4150357023,236096.2910284996 559038.2260356992,235740.6660284996 558985.6990357004,235713.21702849865 558981.6180357002,235712.93332850188 558981.7067357004,235712.66802849993 558981.8408357017,235712.4283284992 558982.016735699,235712.22072850168 558982.2295357026,235712.05102850124 558982.4735357016,235711.9235284999 558982.7421356998,235711.84202849865 558983.0280357003,235711.63642850146 558984.836235702,235711.1211284995 558986.5815357007,235710.31172849983 558988.2115356997,235709.2324285023 558989.6767356992,235707.91592850164 558990.9332357012,235706.40192849934 558991.9430356994,235704.7360284999 558992.6756356992,235702.9685285017 558993.1089357026,235701.1527285017 558993.2300356999,235699.34332850203 558993.0350356996,235697.595028501 558992.5300357006,235697.6270284988 558992.3490357026,235692.2060284987 558991.4810357019,235684.63002850115 558990.4030357003,235678.17602850124 558989.527035702,235672.85702849925 558988.7470357008,235674.28802850097 558978.9840357006,235674.29312850162 558978.3907357007,235674.20142849907 558977.8046356998,235674.01532850042 558977.2412356995,235673.7398285009 558976.7158357017,235673.3823284991 558976.2423356995,235672.9524285011 558975.833535701,235672.46162850037 558975.5002356991,235671.92292850092 558975.2515357025,235671.351028502 558975.0940357,235670.04302849993 558974.9320356995,235631.78802850097 558969.3070356995,235626.21262849867 558968.7641356997,235620.61342849955 558968.9299357012,235615.07992849872 558969.8019357026,235609.70102849975 558971.3660356998,235486.32442849874 559008.4116357006,235487.54202850163 559012.4460357018,235485.88742849976 559012.7949356996,235607.92502849922 559142.8240357004,235696.9961284995 559236.6632357016,235708.4519285001 559234.269935701,235721.40232849866 559295.8656357005,235722.44532850012 559300.8265357018,235724.6570285 559311.3460357003,235731.54302849993 559343.5720357001,235741.0640285015 559382.4350357018,235741.2910284996 559382.9955357015,235741.4860284999 559383.4740357026,235741.5870284997 559383.6870357022,235741.8279285021 559384.2344356999,235742.06182850152 559384.7647357024,235742.28862849995 559385.2778357007,235742.5084284991 559385.7738357,235742.72122849897 559386.2527357005,235742.92692850158 559386.7144357003,235743.12562850118 559387.1590357013,235743.3173285015 559387.5865356997,235743.50192850083 559387.9969356991,235743.67962849885 559388.3901357017,235743.85022849962 559388.7662357017,235744.0137284994 559389.1252356991,235744.1703285016 559389.4670356996,235744.3198284991 559389.7917357013,235744.46232850105 559390.0993357003,235744.597728502 559390.3897357024,235744.72612849995 559390.6631356999,235744.84752849862 559390.9193357006,235744.96192850173 559391.1583357006,235745.06922850013 559391.3803356998,235745.16952849925 559391.585135702,235745.26282849908 559391.7728357017,235745.35112849995 559391.9480357021,235745.43942850083 559392.1225357018,235745.52792850137 559392.2966357023,235745.61682850122 559392.4704357013,235745.70582849905 559392.643835701,235745.79512850195 559392.8170357011,235745.88472849876 559392.9898357019,235745.97452849895 559393.1624356993,235746.0646285005 559393.334635701,235746.1549285017 559393.5064356998,235746.24552850053 559393.6780357026,235746.33632849902 559393.8492357023,235746.42742849886 559394.0202357024,235746.5187285021 559394.1908356994,235746.61022850126 559394.3610357009,235746.70212849975 559394.5310357027,235746.79412849993 559394.7007356994,235746.88652849942 559394.8700357005,235746.97902850062 559395.0390357003,235747.07192850113 559395.2077357024,235747.1649284996 559395.3760357015,235747.25822849944 559395.5441357009,235747.35182850063 559395.711835701,235747.44552849978 559395.8791357018,235747.5394284986 559396.0459357016,235747.6335285008 559396.2124357,235747.72772850096 559396.3783356994,235747.8220284991 559396.5439357013,235747.9166285023 559396.7089357004,235748.0112285018 559396.8736357018,235748.1061284989 559397.0378357023,235748.20112850145 559397.2016356997,235748.29622850195 559397.3649356999,235748.3915285021 559397.5278357007,235748.48702850193 559397.6902357005,235748.58262849972 559397.8522357009,235748.6784285009 559398.0138357021,235748.77432850003 559398.1749357022,235748.87042849883 559398.3356356993,235748.96672850102 559398.4959357008,235749.06312850118 559398.6557357013,235749.1596284993 559398.8150357008,235749.25642849877 559398.973935701,235749.35322850198 559399.1324357018,235749.45062850043 559399.2909357026,235749.55472850055 559399.4582356997,235749.66842849925 559399.6382356994,235749.79152850062 559399.8306357004,235749.92402850091 559400.0357357003,235750.0661284998 559400.2533356994,235750.21752849966 559400.4835356995,235750.37852850184 559400.7262357026,235750.54892849922 559400.9815356992,235750.72872849926 559401.2494357005,235750.91812850162 559401.529835701,235751.1169284992 559401.8228357024,235751.32512849942 559402.1284357011,235751.54282850027 559402.4465356991,235751.77002850175 559402.7772357017,235752.00662850216 559403.1204356998,235752.25272849947 559403.4763357006,235752.50832850114 559403.8446357027,235752.77332850173 559404.2256356999,235753.04782849923 559404.6191357002,235753.33172849938 559405.0252357014,235753.62512850016 559405.4438357018,235753.92802850157 559405.8750356995,235754.05702850223 559406.0690357015,235754.18502850085 559406.2380357012,235754.48292849958 559406.6143357009,235754.77192850038 559406.9790357016,235755.05192850158 559407.3319357,235755.32292849943 559407.6731357016,235755.58512850106 559408.0025357008,235755.83822850138 559408.3203357011,235756.08242850006 559408.6263356991,235756.3177285008 559408.9206357002,235756.54402850196 559409.2032357007,235756.76142850146 559409.4740357026,235756.96982850134 559409.7332357019,235757.16932849959 559409.9806357026,235757.35982850194 559410.2163357027,235757.54142849892 559410.4403357022,235757.71402850002 559410.652635701,235757.87772849947 559410.8531357013,235758.032528501 559411.0419357009,235758.17822850123 559411.2190357,235758.3151285015 559411.3844357021,235758.44302850217 559411.5381356999,235758.5619284995 559411.6800356992,235758.6719284989 559411.8103356995,235758.77542850003 559411.9320356995,235758.87852850184 559412.0529357009,235758.98142850026 559412.1735357009,235759.08422850072 559412.2937357016,235759.1869284995 559412.4135356992,235759.28932850063 559412.5329357013,235759.39162850007 559412.6519357003,235759.49382850155 559412.7706357017,235759.59582849964 559412.8888357021,235759.69772849977 559413.0067357011,235759.79942850024 559413.1242357008,235759.901028499 559413.2413357012,235760.00242850184 559413.3580357023,235760.1036285013 559413.4743357003,235760.20472849905 559413.5902357027,235760.30562850088 559413.7058357,235760.406428501 559413.8210357018,235760.50712849945 559413.9358357005,235760.60752850026 559414.0501357019,235760.70792850107 559414.1642356999,235760.80802850053 559414.2778357007,235760.90802850202 559414.3910357021,235761.00802849978 559414.5040357001,235761.10872850195 559414.6172357015,235761.21012850106 559414.7308357023,235761.3124285005 559414.8448357023,235761.41552850232 559414.9591357,235761.51932850108 559415.0738357008,235761.6239285022 559415.1889357008,235761.72942849994 559415.3043357022,235761.83562850207 559415.4201356992,235761.94262849912 559415.5363356993,235762.05052850023 559415.6528357007,235762.159128502 559415.7698356993,235762.2685284987 559415.8871356994,235762.3787285015 559416.0047357008,235762.4897284992 559416.1227357015,235762.60152849928 559416.2411357015,235762.7141285017 559416.3599357009,235762.82752849907 559416.4790357016,235762.9417284988 559416.5986356996,235763.05672850087 559416.718435701,235763.1725285016 559416.8387356997,235763.28902849928 559416.9593356997,235763.40682850033 559417.0806357004,235763.53402850032 559417.2104356997,235763.67392849922 559417.3518357016,235763.82672850043 559417.5048357025,235763.99232850224 559417.6695357002,235764.17072850093 559417.8457357027,235764.36192850024 559418.033635702,235764.56592850015 559418.2331357002,235764.78272850066 559418.4442357011,235765.0123285018 559418.6669357009,235765.2547284998 559418.9012356997,235765.50992850214 559419.147135701,235765.77792850137 559419.4047356993,235766.0587285012 559419.6738357022,235766.35232850164 559419.9546357021,235766.65872849897 559420.2470357008,235766.97792850062 559420.5510357022,235767.30992849916 559420.8667357005,235767.65472850204 559421.1939356998,235768.0123285018 559421.5327357017,235768.38282850012 559421.8832357004,235768.7660285011 559422.2453357019,235769.16202849895 559422.6190357022,235769.34802849963 559422.777035702,235770.2040285021 559423.5220356993,235786.51102850214 559438.1210357025,235796.06202850118 559446.5720357001,235800.24322849885 559450.158135701,235804.60302850232 559453.5250357017,235805.0160285011 559453.7800357006,235805.45432849973 559454.0815357007,235805.87962850183 559454.3734357022,235806.29172850028 559454.6557357013,235806.69082850218 559454.9285356998,235807.0769285001 559455.1917356998,235807.4498285018 559455.4453357011,235807.8097284995 559455.6894357018,235808.15652849898 559455.9239357002,235808.49022850022 559456.1488357,235808.8109285012 559456.3641357012,235809.1185285002 559456.5699357018,235809.41302850097 559456.7662357017,235809.6944284998 559456.9528357014,235809.96282850206 559457.1299357004,235810.21812849864 559457.2975357026,235810.46032850072 559457.4554357007,235810.6895284988 559457.603835702,235810.90552850068 559457.7427357025,235811.1085285023 559457.8719356991,235811.2985284999 559457.9917357005,235811.4753285013 559458.1018357016,235811.63912849873 559458.2024357021,235811.7936284989 559458.2960356995,235811.94832849875 559458.3892357014,235812.10342850164 559458.4822356999,235812.25912849978 559458.5750357024,235812.41532849893 559458.6676357016,235812.5720284991 559458.7601356991,235812.72932850197 559458.8524357006,235812.88702850044 559458.9445357025,235813.0453285016 559459.0365357026,235813.20412850007 559459.1282357015,235813.36352850124 559459.2198357023,235813.5234284997 559459.3112356998,235813.6837285012 559459.4025356993,235813.84462850168 559459.4935357012,235814.00612850115 559459.5844357014,235814.16802849993 559459.6751357019,235814.33052850142 559459.7657357007,235814.4935285002 559459.8560357019,235814.6570285 559459.9462357014,235814.82112849876 559460.0362357013,235814.98572850227 559460.1261356995,235815.15082849935 559460.2157357,235815.3162285015 559460.3052357025,235815.48102850094 559460.3940357007,235815.64512849972 559460.4822356999,235815.80832850188 559460.5698357001,235815.97072850168 559460.6567356996,235816.1324285008 559460.7430357002,235816.2932284996 559460.8287357017,235816.45332850143 559460.9137357026,235816.6126285009 559460.9981357008,235816.77102850005 559461.0819357,235816.92872850224 559461.1650357023,235817.08562850207 559461.2475357018,235817.24172849953 559461.3293357007,235817.39702850208 559461.4105357006,235817.55152850226 559461.4911357015,235817.70522850007 559461.5711356997,235817.85812849924 559461.650435701,235818.01032850146 559461.7290357016,235818.16162849963 559461.8071357012,235818.31212849915 559461.8844357021,235818.46192850173 559461.961235702,235818.61082850024 559462.0373357013,235818.75932849944 559462.1130357012,235818.91592850164 559462.1918357015,235819.08392849937 559462.2753356993,235819.2633285001 559462.3636357002,235819.45422850177 559462.4565357007,235819.65652849898 559462.5540357009,235819.87032850087 559462.6563357003,235820.09562849998 559462.7633357011,235820.3323285021 559462.8749357015,235820.58042849973 559462.9912356995,235820.84002850205 559463.1123357005,235821.1110284999 559463.2380357012,235821.3935284987 559463.3684356995,235821.6874285005 559463.5034357011,235821.99282849953 559463.6432357021,235822.30962850153 559463.7876357026,235822.63792850077 559463.9368357025,235822.97762849927 559464.090635702,235823.32882849872 559464.2491356991,235823.69142850116 559464.4123357013,235824.06552850083 559464.580235701,235824.45102849975 559464.7527357005,235824.84802849963 559464.9300356992,235825.2960285023 559465.1500357017,235825.50302850083 559465.2240357026,235830.472228501 559467.1300357021,235835.5480284989 559468.7310357019,235846.42002850026 559471.834035702,235848.1686284989 559472.3251357004,235857.92602850124 559475.0250357017,235868.85302850232 559478.038035702,235897.12102850154 559485.9760356992,235914.67602850124 559490.9170357026,235920.63472849876 559492.7682357021,235927.5560285002 559495.5146357007,235934.25442850217 559498.7672357,235940.69302850217 559502.5080357008,235941.08402850106 559502.7330357023,235943.2360284999 559504.1230356991,235945.1960285008 559505.4890356995,235951.1025285013 559510.1176357009,235956.61702850088 559515.2070357017,235959.30402849987 559517.8780357018,235961.44302850217 559519.9940357022,235963.1410285011 559521.6920357011,235964.151028499 559522.6940357015,235964.52202850208 559523.0920356996,235965.72502849996 559524.2900357023,235967.47502849996 559526.020035699,235967.85302850232 559526.3930357024,235968.7270285003 559527.2390356995,235978.85602850094 559537.3050356992,235996.22302849963 559554.6110357009,236012.80102850124 559571.084035702,236030.7960285023 559589.0180357024,236032.05402849987 559590.282035701,236039.12402850017 559597.402035702,236042.54512850195 559601.2307357006,236045.5460285023 559605.3970356993,236049.07492849976 559610.9966357015,236052.05852850154 559616.9049357027,236054.47012849897 559623.0689356998)))\"^^http://www.opengis.net/ont/geosparql#wktLiteral",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    "object": "https://data.pdok.nl/cbs/2015/vocab/Buurt",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/vocab/Buurt",
    "predicate": "http://www.w3.org/2000/01/rdf-schema#label",
    "object": "\"Buurt\"@nl",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    "object": "https://data.pdok.nl/cbs/2015/vocab/Wijk",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/vocab/Wijk",
    "predicate": "http://www.w3.org/2000/01/rdf-schema#label",
    "object": "\"Wijk\"@nl",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    "object": "https://data.pdok.nl/cbs/2015/vocab/Gemeente",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/vocab/Gemeente",
    "predicate": "http://www.w3.org/2000/01/rdf-schema#label",
    "object": "\"Gemeente\"@nl",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "http://www.w3.org/2002/07/owl#sameAs",
    "object": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/buurtNaam",
    "object": "\"De Stoepen\"@nl",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/wijkCode",
    "object": "\"WK010607\"",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/gemeenteNaam",
    "object": "\"Assen\"@nl",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/gemeenteCode",
    "object": "\"GM0106\"",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/éénpersoonsHuishoudens",
    "object": "\"15\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/autos",
    "object": "\"1085\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/oppervlakte",
    "object": "\"51\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/bedrijfsautos",
    "object": "\"30\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/personenautos6+",
    "object": "\"710\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/personenautosNaarOppervlakte",
    "object": "\"2228\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/inwoners",
    "object": "\"2385\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/westerseAllochtonen",
    "object": "\"7\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/mannen",
    "object": "\"1195\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/omgevingsadressendichtheid",
    "object": "\"1009\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/bevolkingsdichtheid",
    "object": "\"4901\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/nietWesterseAllochtonen",
    "object": "\"4\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/huishoudensZonderKinderen",
    "object": "\"24\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/personen0-14",
    "object": "\"24\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/personenautosBenzine",
    "object": "\"850\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/personenautos0-5",
    "object": "\"375\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/oppervlakteLand",
    "object": "\"49\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/ao",
    "object": "\"50\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/gescheiden",
    "object": "\"1\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/huishoudensMetKinderen",
    "object": "\"61\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/gehuwd",
    "object": "\"45\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/vrouwen",
    "object": "\"1185\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/personen15-24",
    "object": "\"13\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/personen25-44",
    "object": "\"23\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/verweduwd",
    "object": "\"6\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/personenautosOverigeBrandstof",
    "object": "\"230\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/personen65+",
    "object": "\"6\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/huishoudens",
    "object": "\"825\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/bijstand",
    "object": "\"10\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/ongehuwd",
    "object": "\"48\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/motorTweewielers",
    "object": "\"125\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/nietWestersOverig",
    "object": "\"3\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/aow",
    "object": "\"140\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/personen45-64",
    "object": "\"34\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/turks",
    "object": "\"0\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/ww",
    "object": "\"60\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/antillianen",
    "object": "\"0\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/surinaams",
    "object": "\"0\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/oppervlakteWater",
    "object": "\"3\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/marokkanen",
    "object": "\"0\"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/huishoudenGrootte",
    "object": "\"2.9E0\"^^http://www.w3.org/2001/XMLSchema#float",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/personenautosPerHuishouden",
    "object": "\"1.3E0\"^^http://www.w3.org/2001/XMLSchema#float",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/water",
    "object": "\"false\"^^http://www.w3.org/2001/XMLSchema#boolean",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/stedelijkheid",
    "object": "\"3\"",
    "graph": ""
  },
  {
    "subject": "https://data.pdok.nl/cbs/2015/id/buurt/BU01060710",
    "predicate": "https://data.pdok.nl/cbs/2015/vocab/indelingswijziging",
    "object": "\"1\"",
    "graph": ""
  }
], 'https://data.pdok.nl/cbs/2015/id/buurt/BU01060710');
      expect(paths).to.have.lengthOf(5)
    })
  })
})