export default function projectHomePage({
  params,
}: {
  params: { clusterid: string; projectid: string };
}) {
  return (
    <div>
      project Dashboard
      显示项目下的配额已经使用的数量和剩余的数量，使用的时间线，流量数据
    </div>
  );
}
