export default function serviceDetailPage({
  params,
}: {
  params: { clusterid: string; projectid: string; serviceid: string };
}) {
  return (
    <div>
      clusterid: {params.clusterid} projectid: {params.projectid} serviceid:{" "}
      {params.serviceid} Dashboard
      放一些构建成功和失败的比例图表，以及一些其他的信息
    </div>
  );
}
