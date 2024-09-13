"use client";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ProjectServices } from "@/services/project/v1alpha1/project";
import type { Project, Service, Port } from "@/types/types";
import { useToast } from "@/components/ui/use-toast";
import { ServiceServices } from "@/services/service/v1alpha1/service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageComponent } from "@/components/pagination";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

export default function ServicePage({
  params,
}: {
  params: { clusterid: string; projectid: string };
}) {
  const netProtocols = ["TCP", "UDP"];
  const { toast } = useToast();
  const [project, setProject] = React.useState<Project>();
  const [serviceSearchName, setServiceSearchName] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageCount, setPageCount] = React.useState(0);
  const [addEditOpen, setAddEditOpen] = React.useState(false);
  const [gpuOnOff, setGpuOnOff] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState<Service>();
  const [selectedPorts, setSelectedPorts] = React.useState<Port[]>([
    {
      id: "0",
      ingress_path: "",
      container_port: 0,
      protocol: "",
    },
  ]);
  const [services, setServices] = React.useState<Service[]>([]);

  const addPortInput = () => {
    setSelectedPorts([
      ...selectedPorts,
      {
        id: String(selectedPorts.length),
        ingress_path: "",
        container_port: 0,
        protocol: "",
      },
    ]);
  };

  const removePortInput = (id: string) => {
    setSelectedPorts(selectedPorts.filter((item) => item.id !== id));
  };

  const getProject = React.useCallback(
    (projectid: string) => {
      ProjectServices.getDetail(projectid).then((data) => {
        if (data instanceof Error) {
          toast({
            title: "project item fail",
            variant: "destructive",
            description: data.message,
          });
          return;
        }
        setProject(data as Project);
      });
    },
    [toast]
  );

  const serviceList = React.useCallback(
    (projectId: string, name: string, page: number, pageSize: number) => {
      if (!projectId || projectId === "") {
        projectId = "";
      }
      ServiceServices.getList({
        project_id: projectId,
        name: name,
        page: page,
        page_size: pageSize,
      }).then((data) => {
        if (data instanceof Error) {
          toast({
            title: "services items fail",
            variant: "destructive",
            description: data.message,
          });
          return;
        }
        setServices(data.services as Service[]);
        setPageCount(Math.ceil(data.total / pageSize));
      });
    },
    [toast]
  );

  React.useEffect(() => {
    getProject(params.projectid);
  }, [params.projectid, getProject]);

  React.useEffect(() => {
    serviceList(params.projectid, serviceSearchName, page, 10);
  }, [serviceList, params.projectid, page, serviceSearchName]);

  const updateSelectedService = (changes: any) => {
    setSelectedService((prevState) => ({
      id: prevState?.id || 0,
      ...prevState,
      ...changes,
    }));
  };

  const updateSelectedPort = (id: string, changes: any) => {
    setSelectedPorts((prevState) =>
      prevState.map((port) => (port.id === id ? { ...port, ...changes } : port))
    );
  };

  const getSelectedService = (id: string) => {
    ServiceServices.get(id).then((data) => {
      if (data instanceof Error) {
        toast({
          title: "service get fail",
          variant: "destructive",
          description: data.message,
        });
        return;
      }
      setSelectedService(data as Service);
      setSelectedPorts(data.ports as Port[]);
    });
  };

  const sumbitService = () => {
    setAddEditOpen(false);
    if (!selectedService || !selectedPorts) {
      toast({
        title: "service",
        variant: "destructive",
        description: "service or port is empty",
      });
      return;
    }
    selectedService.project_id = params.projectid;
    if (
      selectedService.project_id === "" ||
      selectedService.business === "" ||
      selectedService.technology === "" ||
      selectedService.name === "" ||
      selectedService.code_repo === ""
    ) {
      toast({
        title: "service",
        variant: "destructive",
        description: "param is empty",
      });
      return;
    }

    selectedService.ports = selectedPorts;
    if (!gpuOnOff) {
      selectedService.gpu = 0;
      selectedService.limit_gpu = 0;
    }
    ServiceServices.save(selectedService).then((data) => {
      if (data instanceof Error) {
        toast({
          title: "service save fail",
          variant: "destructive",
          description: data.message,
        });
        return;
      }
      serviceList(project?.id as string, serviceSearchName, page, 10);
      toast({
        title: "service",
        description: "service save success",
      });
    });
  };

  const deleteSerivce = (id: string) => {
    ServiceServices.delete(id).then((data) => {
      if (data instanceof Error) {
        toast({
          title: "service delete fail",
          variant: "destructive",
          description: data.message,
        });
        return;
      }
      serviceList(project?.id as string, serviceSearchName, page, 10);
      toast({
        title: "service",
        description: "service delete success",
      });
    });
  };

  const AddEdit = () => {
    return (
      <Dialog open={addEditOpen} onOpenChange={setAddEditOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add New</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl h-4/5">
          <DialogHeader>
            <DialogTitle>New or edit service</DialogTitle>
            <DialogDescription>
              Add or edit a service to your project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 h-5/5 overflow-auto">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project" className="text-right">
                Project
              </Label>
              <Select
                disabled
                onValueChange={(val) =>
                  updateSelectedService({
                    project_id: params.projectid,
                  })
                }
                value={project?.name}
              >
                <SelectTrigger className="col-span-3 w-[360px]">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      key={project?.id}
                      value={project?.name as string}
                    >
                      {project?.name}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project" className="text-right">
                Business
              </Label>
              <Select
                onValueChange={(val) =>
                  updateSelectedService({
                    business: val,
                  })
                }
                value={selectedService?.business}
              >
                <SelectTrigger className="col-span-3 w-[360px]">
                  <SelectValue placeholder="Select a business" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {project?.business.map((businessval) => (
                      <SelectItem
                        key={businessval.name}
                        value={businessval.name}
                      >
                        {businessval.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project" className="text-right">
                Technology
              </Label>
              <Select
                onValueChange={(val) =>
                  updateSelectedService({
                    technology: val,
                  })
                }
                value={selectedService?.technology}
              >
                <SelectTrigger className="col-span-3 w-[360px]">
                  <SelectValue placeholder="Select a technology" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {project?.business
                      .find(
                        (business) =>
                          business.name === selectedService?.business
                      )
                      ?.technologys.map((technologyval) => (
                        <SelectItem
                          key={technologyval.name}
                          value={technologyval.name}
                        >
                          {technologyval.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Service name"
                className="col-span-3 w-[360px]"
                onChange={(e) =>
                  updateSelectedService({
                    name: e.target.value,
                  })
                }
                value={selectedService?.name}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="coderepo" className="text-right">
                Code repo
              </Label>
              <Input
                id="coderepo"
                type="url"
                placeholder="https://github.com/f-rambo/ocean"
                className="col-span-3 w-[360px]"
                onChange={(e) =>
                  updateSelectedService({
                    code_repo: e.target.value,
                  })
                }
                value={selectedService?.code_repo}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="replicas" className="text-right">
                Replicas
              </Label>
              <Input
                id="replicas"
                type="number"
                placeholder="3"
                className="col-span-3 w-[360px]"
                onChange={(e) =>
                  updateSelectedService({
                    replicas: parseInt(e.target.value),
                  })
                }
                value={selectedService?.replicas}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cpu" className="text-right">
                CPU
              </Label>
              <Input
                id="cpu"
                type="number"
                placeholder="0.5 (500m)"
                className="col-span-3 w-[360px]"
                onChange={(e) =>
                  updateSelectedService({
                    cpu: parseFloat(e.target.value),
                  })
                }
                value={selectedService?.cpu}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="limitcpu" className="text-right">
                Limit CPU
              </Label>
              <Input
                id="limitcpu"
                type="number"
                placeholder="3"
                className="col-span-3 w-[360px]"
                onChange={(e) =>
                  updateSelectedService({
                    limit_cpu: parseFloat(e.target.value),
                  })
                }
                value={selectedService?.limit_cpu}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="memory" className="text-right">
                Memory
              </Label>
              <Input
                id="memory"
                type="number"
                placeholder="1 (1g)"
                className="col-span-3 w-[360px]"
                onChange={(e) =>
                  updateSelectedService({
                    memory: parseFloat(e.target.value),
                  })
                }
                value={selectedService?.memory}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="limitmemory" className="text-right">
                Limit Memory
              </Label>
              <Input
                id="limitmemory"
                type="number"
                placeholder="3"
                className="col-span-3 w-[360px]"
                onChange={(e) =>
                  updateSelectedService({
                    limit_memory: parseFloat(e.target.value),
                  })
                }
                value={selectedService?.limit_memory}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="disk" className="text-right">
                Disk
              </Label>
              <Input
                id="disk"
                type="number"
                placeholder="1 (1g)"
                className="col-span-3 w-[360px]"
                onChange={(e) =>
                  updateSelectedService({
                    disk: parseFloat(e.target.value),
                  })
                }
                value={selectedService?.disk}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="limitdisk" className="text-right">
                Limit Disk
              </Label>
              <Input
                id="limitdisk"
                type="number"
                placeholder="3"
                className="col-span-3 w-[360px]"
                onChange={(e) =>
                  updateSelectedService({
                    limit_disk: parseFloat(e.target.value),
                  })
                }
                value={selectedService?.limit_disk}
              />
            </div>
            {selectedPorts.map((selectPort) => (
              <div
                key={selectPort.id}
                className="grid grid-cols-4 items-center gap-4"
              >
                <Label
                  htmlFor={`portprotocol${selectPort.id}`}
                  className="text-right"
                >
                  Port
                </Label>
                <div className="flex">
                  <Select
                    key={selectPort.id}
                    onValueChange={(v) =>
                      updateSelectedPort(selectPort.id, {
                        protocol: v,
                      })
                    }
                    value={
                      selectedPorts.find((port) => port.id === selectPort.id)
                        ?.protocol
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="portprotocol" />
                    </SelectTrigger>
                    <SelectContent>
                      {netProtocols.map((protocol) => (
                        <SelectItem key={protocol} value={protocol}>
                          {protocol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="port"
                    placeholder="8080"
                    type="number"
                    className="col-span-3 w-[160px] ml-3"
                    onChange={(e) =>
                      updateSelectedPort(selectPort.id, {
                        container_port: parseInt(e.target.value),
                      })
                    }
                    value={
                      selectedPorts.find((port) => port.id === selectPort.id)
                        ?.container_port
                    }
                  />
                  {selectPort.id === "0" && (
                    <Button
                      onClick={addPortInput}
                      className="ml-3"
                      variant="outline"
                    >
                      +
                    </Button>
                  )}
                  {selectPort.id !== "0" && (
                    <Button
                      onClick={() => removePortInput(selectPort.id)}
                      className="ml-3"
                      variant="outline"
                    >
                      -
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <div className="grid grid-cols-4 items-center gap-4"></div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="switchgpu" className="text-right">
                GPU On/Off
              </Label>
              <Switch id="switchgpu" onCheckedChange={setGpuOnOff} />
            </div>
            {gpuOnOff && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="gpu" className="text-right">
                    GPU
                  </Label>
                  <Input
                    id="gpu"
                    type="number"
                    placeholder="1"
                    className="col-span-3 w-[360px]"
                    onChange={(e) =>
                      updateSelectedService({
                        gpu: parseInt(e.target.value),
                      })
                    }
                    value={selectedService?.gpu}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="limitgpu" className="text-right">
                    Limit GPU
                  </Label>
                  <Input
                    id="limitgpu"
                    type="number"
                    placeholder="3"
                    className="col-span-3 w-[360px]"
                    onChange={(e) =>
                      updateSelectedService({
                        limit_gpu: parseInt(e.target.value),
                      })
                    }
                    value={selectedService?.limit_gpu}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={sumbitService}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <div className="flex flex-1">
          <Input
            className="bg-white dark:bg-gray-950 max-w-sm mr-3"
            placeholder="Search services..."
            type="search"
            value={serviceSearchName}
            onChange={(e) => setServiceSearchName(e.target.value)}
          />
        </div>
        {AddEdit()}
      </div>

      <Table>
        <TableCaption>A list of your services.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Project Name</TableHead>
            <TableHead>Business/Technology</TableHead>
            <TableHead>Ports</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.id}</TableCell>
              <TableCell>{service.name}</TableCell>
              <TableCell>{service.project_name}</TableCell>
              <TableCell>
                {service.business}/{service.technology}
              </TableCell>
              <TableCell>
                {service.ports.map((port) => (
                  <div key={port.id}>
                    {port.protocol}/{port.container_port}
                  </div>
                ))}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <DotsHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => navigator.clipboard.writeText(service.id)}
                    >
                      Copy project ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        (window.location.href = `/home/cluster/${params.clusterid}/project/${params.projectid}/service/${service.id}`)
                      }
                    >
                      Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setAddEditOpen(true);
                        getSelectedService(service.id);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteSerivce(service.id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow></TableRow>
        </TableFooter>
      </Table>
      <div className="mt-3">
        <PageComponent
          totalPages={pageCount}
          pageRange={3}
          onPageChange={(page: number) => setPage(page)}
        />
      </div>
    </div>
  );
}
