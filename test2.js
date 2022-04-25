const paginationAttr: any = {
  position: ['bottomRight'],
  pageSizeOptions: [10, 20, 50, 100], // 自定义每页显示多少条数据
  defaultPageSize: [10], // 默认每页显示10条数据
  showSizeChanger: true, // 显示下拉选项页码
  showQuickJumper: true, // 显示允许跳转至xx页
};

const ContentOrderDetail: React.FC = (props) => {
  // 发送 action
   const params1 = {
      'orderNo': props.location.query.transporterOrderNo,
  };
  const [resData, setResData] = useState({});
  const [resDeatilData, setResDeatilData] = useState([]);
  const [resOrderStatus, setResOrderStatus] = useState([]);
  const [statusEnums, setStatusEnums] = useState<any>('');
  
  // 订单详情
  function getData() {
      const orderNo = {
          'orderNo': props.location.query.orderNo,
      };
      queryOrderDetails(orderNo).then(async(res) => {// 异步加载数据
          setResData(res.data.data);
          console.log(resData);
          const dictRes = await ValueEnum.getTransportTypeText(resData.transportCondition, transportType);
          setStatusEnums(dictRes);
          setResDeatilData(res.data.data.details);
      });
  }
  // 路由信息
  function queryOrderStatusData() {
      const orderNo = {
          'order_id': props.location.query.orderNo,
      };
      queryOrderStatus(orderNo).then((res) => {// 异步加载数据
          if (!res.data) {
              setResOrderStatus(res.data.data.feed);
          }
      });
  }
  // 物流轨迹
  function queryOrderTrackData() {
      const orderNo = {
          'orderNumber': props.location.query.orderNo,
          'orderCreateTime': props.location.query.orderCreateTime,
      };
      queryOrderTrack(orderNo).then((res) => {// 异步加载数据
          // setResDeatilData(res.data.data);
      });
  }
  // 全程温控
  function queryOrderHumidityData() {
      const orderNo = {
          'orderNumber': props.location.query.orderNo,
          'orderCreateTime': props.location.query.orderCreateTime,
      };
      queryOrderHumidity(orderNo).then((res) => {// 异步加载数据
          // setResDeatilData(res.data.data);
      });
  }
  const [transportCondition,setTransportCondition]=useState('')
  useEffect(() => {
      (async function initForm() {
         
      })();
  }, [resData]);
  useEffect(() => {
      getData();
      queryOrderStatusData();
      queryOrderTrackData();
      queryOrderHumidityData();
  }, []);
  // @ts-ignore
  return (