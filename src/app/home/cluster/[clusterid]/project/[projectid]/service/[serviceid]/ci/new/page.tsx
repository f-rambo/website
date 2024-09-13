"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, MinusIcon } from "@/components/icon";
import { ServiceServices } from "@/services/service/v1alpha1/service";
import { Worklfow, WfTemplate, WfTask, WfStep } from "@/types/types";
import { useToast } from "@/components/ui/use-toast";
import { CodeIcon, CodeSandboxLogoIcon } from "@radix-ui/react-icons";
import { Code } from "@nextui-org/react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { steps } from "framer-motion";

const ci = "ci";

export default function CINewPage({
  params,
}: {
  params: { clusterid: string; projectid: string; serviceid: string };
}) {
  const { clusterid, projectid, serviceid } = params;
  const { toast } = useToast();
  const [workflow, setWorkflow] = React.useState<Worklfow | null>(null);
  const [tasksItemOpen, setTasksItemOpen] = React.useState(false);
  const [addTaskOpen, setAddTaskOpen] = React.useState(false);
  const [currentStepName, setCurrentStepName] = React.useState("");
  const [wftmplate, setWftmplate] = React.useState<WfTemplate | null>(null);
  const [addStepOpen, setAddStepOpen] = React.useState(false);
  const [removeStepOpen, setRemoveStepOpen] = React.useState(false);
  const [wfStep, setWfStep] = React.useState<WfStep | null>(null);

  const updateWftmplate = (changes: any) => {
    setWftmplate((prevState) => ({
      name: prevState?.name || "",
      ...prevState,
      ...changes,
    }));
  };

  const updateWfStep = (changes: any) => {
    setWfStep((prevState) => ({
      name: prevState?.name || "",
      ...prevState,
      ...changes,
    }));
  };

  React.useEffect(() => {
    ServiceServices.getWorkflow(serviceid, ci).then((res) => {
      if (res instanceof Error) {
        toast({
          title: "get workflow failed",
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      setWorkflow(res);
    });
  }, [serviceid, toast]);

  function truncateStringWithEllipsis(
    input: any,
    maxlength: number
  ): string | null {
    if (typeof input !== "string") {
      console.warn(
        "Invalid input: Expected a string but received",
        typeof input
      );
      return null;
    }

    const str = input as string;

    if (str.length > maxlength) {
      return str.substring(0, maxlength) + "...";
    }

    return str;
  }

  function concatenateStringsWithEllipsisAndNewlines(
    strings: string[]
  ): string {
    if (!strings || strings.length === 0) {
      return "";
    }
    if (strings.length === 1) {
      return truncateStringWithEllipsis(strings[0], 26) as string;
    }
    return strings.map((str) => truncateStringWithEllipsis(str, 26)).join("\n");
  }

  function splitStringWithNewlines(input: string[], separator: string): string {
    if (!input || input.length === 0) {
      return "";
    }
    if (input.length === 1) {
      return input[0];
    }
    return input?.join(separator);
  }

  const delTask = (taskName: string) => {
    if (currentStepName === "" || !workflow || taskName === "") {
      toast({
        title: "delete task failed",
        variant: "destructive",
        description: "Please select a step and a task",
      });
      return;
    }
    const newSteps = workflow.steps.map((step) => {
      if (step.name === currentStepName) {
        const newTasks = step.tasks.filter(
          (task: any) => task.name !== taskName
        );
        return {
          name: step.name,
          tasks: newTasks,
        };
      }
      return step;
    });
    workflow.steps = newSteps;
    ServiceServices.saveWorkflow(serviceid, ci, workflow).then((res) => {
      if (res instanceof Error) {
        toast({
          title: "update workflow failed",
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      toast({
        title: "update workflow success",
        description: "Workflow updated successfully",
      });
    });
    setWorkflow(workflow);
  };

  const taskItems = () => {
    if (!currentStepName || currentStepName === "") {
      return;
    }
    const taskItems = workflow?.steps?.find(
      (step) => step.name === currentStepName
    );
    let taskTemplates: WfTemplate[] = [];
    if (taskItems?.tasks) {
      taskTemplates = taskItems?.tasks.map((t: any) =>
        workflow?.templates?.find(
          (template) => template.name === t.template_name
        )
      );
    }

    function findTaskByTemplateName(templateName: string): WfTask {
      return taskItems?.tasks?.find(
        (t: any) => t.template_name === templateName
      ) as WfTask;
    }

    return (
      <Dialog open={tasksItemOpen} onOpenChange={setTasksItemOpen}>
        <DialogContent className="sm:max-w-3xl">
          <Table aria-label="tasks table">
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>IMAGE</TableColumn>
              <TableColumn>COMMAND</TableColumn>
              <TableColumn>ARGS/SOURCE</TableColumn>
              <TableColumn>Action</TableColumn>
            </TableHeader>
            <TableBody>
              {taskTemplates?.map((template) => (
                <TableRow key={template.name}>
                  <TableCell>{template.name}</TableCell>
                  <TableCell>{template.image}</TableCell>
                  <TableCell>
                    {splitStringWithNewlines(template.command, "  ")}
                  </TableCell>
                  <TableCell>
                    <div className=" bg-gray-100 p-3 overflow-auto rounded-lg">
                      {template.is_script ? template.source : template.args}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size={"sm"}
                      variant={"destructive"}
                      disabled={findTaskByTemplateName(template.name)?.default}
                      onClick={() => {
                        delTask(findTaskByTemplateName(template.name)?.name);
                      }}
                    >
                      Del
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    );
  };

  const saveTask = () => {
    if (!currentStepName || !wftmplate || !workflow) {
      toast({
        title: "save task failed",
        variant: "destructive",
        description: "Please select a step and a task",
      });
      return;
    }
    workflow.templates = [...workflow.templates, wftmplate];

    let taskItems = workflow?.steps?.find(
      (step) => step.name === currentStepName
    ).tasks;
    if (!taskItems) {
      return;
    }
    if (!wftmplate.previous_task || wftmplate.previous_task === "") {
      taskItems = [
        { name: wftmplate.name, template_name: wftmplate.name },
        ...taskItems,
      ];
    } else {
      const index = taskItems.findIndex(
        (t: any) => t.template_name === wftmplate.previous_task
      );
      if (index === -1) {
        console.warn("Previous task not found");
        return;
      }
      taskItems.splice(index + 1, 0, {
        name: wftmplate.name,
        template_name: wftmplate.name,
      });
    }

    const newSteps = workflow.steps.map((step) => {
      if (step.name === currentStepName) {
        return {
          name: step.name,
          tasks: taskItems,
        };
      }
      return step;
    });
    workflow.steps = newSteps;
    ServiceServices.saveWorkflow(serviceid, ci, workflow).then((res) => {
      if (res instanceof Error) {
        toast({
          title: "update workflow failed",
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      toast({
        title: "update workflow success",
        description: "Workflow updated successfully",
      });
    });
    setWorkflow(workflow);
    setWftmplate(null);
    setAddTaskOpen(false);
  };

  const addTask = () => {
    if (!currentStepName || currentStepName === "") {
      return;
    }
    const taskItems = workflow?.steps?.find(
      (step) => step.name === currentStepName
    );
    let taskTemplates: WfTemplate[] = [];
    if (taskItems?.tasks) {
      taskTemplates = taskItems?.tasks.map((t: any) =>
        workflow?.templates?.find(
          (template) => template.name === t.template_name
        )
      );
    }

    return (
      <Dialog open={addTaskOpen} onOpenChange={setAddTaskOpen}>
        <DialogContent className="sm:max-w-1xl">
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
            <DialogDescription>
              Select a task and add a new one after it. If you do not select it,
              it will be first in line.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Previous Task
              </Label>
              <Select
                onValueChange={(value) =>
                  updateWftmplate({
                    previous_task: value,
                  })
                }
                value={wftmplate?.previous_task || ""}
              >
                <SelectTrigger className="w-[340px]">
                  <SelectValue placeholder={"Select a task"} />
                </SelectTrigger>
                <SelectContent>
                  {taskTemplates.map((task) => (
                    <SelectItem key={task.name} value={task.name}>
                      {task.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Name</Label>
              <Input
                value={wftmplate?.name || ""}
                placeholder="task name"
                className="col-span-3"
                onChange={(e) => {
                  updateWftmplate({
                    name: e.target.value,
                  });
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Image</Label>
              <Input
                value={wftmplate?.image || ""}
                placeholder="container image"
                className="col-span-3"
                onChange={(e) => {
                  updateWftmplate({
                    image: e.target.value,
                  });
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Command</Label>
              <Input
                value={wftmplate?.command || ""}
                placeholder="shell/script command"
                className="col-span-3"
                onChange={(e) => {
                  updateWftmplate({
                    command: e.target.value,
                  });
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Is Script</Label>
              <div className="flex items-center space-x-2 w-[340px]">
                <Checkbox
                  checked={wftmplate?.is_script}
                  onCheckedChange={(checkState) => {
                    updateWftmplate({
                      is_script: checkState || false,
                    });
                  }}
                />
                <label>True if it is a python or shell script.</label>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Args/Source</Label>
              <Textarea
                className="w-[340px] h-[200px]"
                placeholder="Write your script or command"
                onChange={(e) => {
                  updateWftmplate({
                    args: e.target.value,
                    sources: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                saveTask();
                setAddTaskOpen(false);
              }}
              variant="default"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const addStep = () => {
    const save = () => {
      if (!wfStep || !workflow) {
        toast({
          title: "save step failed",
          variant: "destructive",
          description: "Please select a step",
        });
        return;
      }
      if (!wfStep.previous_step || wfStep.previous_step === "") {
        workflow.steps = [...workflow.steps, { name: wfStep.name, tasks: [] }];
      } else {
        const index = workflow.steps.findIndex(
          (s: any) => s.name === wfStep.previous_step
        );
        if (index === -1) {
          console.warn("Previous step not found");
          return;
        }
        workflow.steps.splice(index + 1, 0, {
          name: wfStep.name,
          tasks: [],
        });
      }

      ServiceServices.saveWorkflow(serviceid, ci, workflow).then((res) => {
        if (res instanceof Error) {
          toast({
            title: "update workflow failed",
            variant: "destructive",
            description: res.message,
          });
          return;
        }
        toast({
          title: "update workflow success",
          description: "Workflow updated successfully",
        });
      });
      setWorkflow(workflow);
      setWfStep(null);
      setAddStepOpen(false);
    };

    return (
      <Dialog open={addStepOpen} onOpenChange={setAddStepOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Step</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Previous Step</Label>
              <Select
                onValueChange={(value) =>
                  updateWfStep({ previous_step: value })
                }
                value={wfStep?.previous_step || ""}
              >
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select a Previous Step" />
                </SelectTrigger>
                <SelectContent>
                  {workflow?.steps?.map((step) => (
                    <SelectItem key={step.name} value={step.name}>
                      {step.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Step Name</Label>
              <Input
                value={wfStep?.name || ""}
                placeholder="step name"
                className="col-span-3"
                onChange={(e) => {
                  updateWfStep({
                    name: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => save()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const removeStep = () => {
    if (!workflow) {
      return;
    }
    const steps = workflow.steps || [];
    const delStep = (stepName: string) => {
      const index = steps.findIndex((s) => s.name === stepName);
      if (index === -1) {
        console.warn("Step not found");
        return;
      }
      steps.splice(index, 1);
      workflow.steps = steps;
      ServiceServices.saveWorkflow(serviceid, ci, workflow).then((res) => {
        if (res instanceof Error) {
          toast({
            title: "update workflow failed",
            variant: "destructive",
            description: res.message,
          });
          return;
        }
        toast({
          title: "update workflow success",
          description: "Workflow updated successfully",
        });
      });
      setRemoveStepOpen(false);
      setWorkflow(workflow);
    };
    return (
      <Dialog open={removeStepOpen} onOpenChange={setRemoveStepOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remove Step</DialogTitle>
          </DialogHeader>
          <Table aria-label="Example static collection table">
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>Task Count</TableColumn>
              <TableColumn>Action</TableColumn>
            </TableHeader>
            <TableBody>
              {steps.map((stepItem) => (
                <TableRow key={stepItem?.name}>
                  <TableCell>{stepItem.name}</TableCell>
                  <TableCell className="text-right">
                    {stepItem.tasks?.length}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => delStep(stepItem.name)}
                    >
                      Del
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    );
  };

  const commitWf = () => {
    if (!workflow) {
      toast({
        title: "commit workflow failed",
        variant: "destructive",
        description: "Please select a workflow",
      });
      return;
    }
    ServiceServices.commitWorklfow(serviceid, ci, workflow.id).then((res) => {
      if (res instanceof Error) {
        toast({
          title: "commit workflow failed",
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      toast({
        title: "commit workflow success",
        description: "Workflow committed successfully",
      });
    });
  };

  return (
    <div className="flex flex-col space-y-6">
      {taskItems()}
      {addTask()}
      {addStep()}
      {removeStep()}
      <div className="flex justify- space-x-4 overflow-x-auto">
        {workflow?.steps?.map((step) => (
          <div
            key={step.name}
            className="flex flex-col space-y-4 p-4 rounded-lg shadow-md w-1/5 shrink-0 bg-gray-50"
          >
            <div className="flex justify-between items-center bg-gray-200 p-3 border border-gray-300 rounded-lg">
              <h3 className="text-base font-semibold">{step.name}</h3>
              <Badge>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <button
                      onClick={() => {
                        setCurrentStepName(step.name);
                        setTasksItemOpen(true);
                      }}
                    >
                      {step.tasks.length}
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-5/5 text-xs">
                    details
                  </HoverCardContent>
                </HoverCard>
              </Badge>
            </div>
            {step.tasks.map((task: any) => (
              <Card key={task.name} className="space-y-2 p-3 overflow-auto">
                <div className="flex">
                  <CodeSandboxLogoIcon className="w-4 h-4 mt-1" />
                  <h3 className="font-semibold text-sm ml-2">
                    {
                      workflow.templates.find(
                        (t) => t.name === task.template_name
                      )?.image
                    }
                  </h3>
                </div>

                <div className="flex mt-2">
                  <CodeIcon className="w-4 h-4 mt-1" />
                  <Code size="sm" className="ml-2">
                    {splitStringWithNewlines(
                      workflow.templates.find(
                        (t) => t.name === task.template_name
                      )?.command,
                      "  "
                    )}
                  </Code>
                </div>

                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Code size="sm">
                      {concatenateStringsWithEllipsisAndNewlines(
                        workflow.templates.find(
                          (t) => t.name === task.template_name
                        )?.args as string[]
                      )}
                    </Code>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className=" bg-gray-100 p-3 overflow-auto rounded-lg">
                      {
                        workflow.templates.find(
                          (t) => t.name === task.template_name
                        )?.args as string[]
                      }
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </Card>
            ))}
            <Button
              onClick={() => {
                setCurrentStepName(step.name);
                setAddTaskOpen(true);
              }}
              className="mt-auto bg-gray-200 text-sm"
              variant="outline"
            >
              Add Task
            </Button>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center bg-gray-50 p-3 border-gray-300 rounded-lg">
        <div className="flex space-x-2 justify-end">
          <Button
            className="bg-gray-200"
            size="sm"
            variant="outline"
            onClick={() => setAddStepOpen(true)}
          >
            <PlusIcon className="h-4 w-4" />
            Add Step
          </Button>
          <Button
            className="bg-gray-200"
            size="sm"
            variant="outline"
            onClick={() => setRemoveStepOpen(true)}
          >
            <MinusIcon className="h-4 w-4" />
            Remove Step
          </Button>
        </div>
        <div className="flex flex-col space-y-2 justify-center">
          <p className="text-sm">{workflow?.name}</p>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            className="bg-gray-200"
            onClick={() => commitWf()}
          >
            Commit
          </Button>
        </div>
      </div>
    </div>
  );
}
