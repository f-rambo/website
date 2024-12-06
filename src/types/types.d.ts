import React, { ReactNode } from 'react';

type ChildContainerProps = {
      children: ReactNode;
};

type User = {
      id: string;
      username: string;
      email: string;
      access_token: string;
      status_string: string;
      updated_at: string;
      sign_type_string: string;
      password: string;
}


type AppType = {
      id: string;
      name: string;
}

type AppHelmRepo = {
      id: string;
      name: string;
      url: string;
      description: string;
}
  
type App = {
      id: string;
      name: string;
      icon: string;
      app_type_id: string;
      app_type_name: string;
      app_helm_repo_id: string;
      versions: AppVersion[];
      update_time: string;
}

type AppVersion = {
      id: string;
      app_id: string;
      app_name: string;
      name: string;
      chart: string;
      version: string;
      config: string;
      readme: string;
      state: string;
      test_result: string;
      description: string;
      metadata: Metadata;
}

type Metadata = {
      name: string;
      home: string;
      sources: string[];
      version: string;
      description: string;
      keywords: string[];
      maintainers: Maintainer[];
      icon: string;
      apiVersion: string;
      condition: string;
      tags: string;
      appVersion: string;
      deprecated: boolean;
      annotations: Record<string, string>;
      kubeVersion: string;
      dependencies: Dependency[];
      type: string;
}

type Maintainer = {
      name: string;
      email: string;
      url: string;
}

type Dependency = {
      name: string;
      version: string;
      repository: string;
      condition: string;
      tags: string[];
      enabled: boolean;
      importValues: string[];
      alias: string;
}

type Repositorie = {
      id: string;
      name: string;
      url: string;
      description: string;
}

type ClusterArgs = {
      id: string;
      name: string;
      type: number;
      private_key: string;
      public_key: string;
      region: string;
      access_id: string;
      access_key: string;
      nodes: NodeArgs[];
      edit: boolean;
};
    
type NodeArgs = {
      id: string;
      ip: string;
      user: string;
      role: number;
};

type ClusterType = {
      id: number;
      name: string;
      is_cloud: boolean;
}

type ClusterStatus = {
      id: number;
      name: string;
}

// ClusterLevel
type ClusterLevel = {
      id: number;
      name: string;
}

// NodeStatus
type NodeStatus = {
      id: number;
      name: string;
}

// NodeGroupType
type NodeGroupType = {
      id: number;
      name: string;
}

// NodeRole
type NodeRole = {
      id: number;
      name: string;
}

// ResourceType
type ResourceType = {
      id: number;
      name: string;
}

type Cluster = {
      id: string;
      name: string;
      version: string;
      status: number;
      type: number;
      public_key: string;
      private_key: string;
      region: string;
      access_id: string;
      access_key: string;
      create_at: string;
      update_at: string;
      api_server_address: string;
      nodes: Node[];
      node_groups: NodeGroup[];
      bostion_host: BostionHost;
};

type NodeGroup = {
      id: string;
      name: string;
      type: number;
      os: string;
      arch: string;
      cpu: number;
      memory: number;
      gpu: number;
      gpu_spec: string;
      system_disk_size: number;
      data_disk_size: number;
      min_size: number;
      max_size: number;
      target_size: number;
      update_at: string;
};

type Node = {
      id: string;
      name: string;
      ip: string;
      user: string;
      role: number;
      status: number;
      instance_id: string;
      update_at: string;
};

type BostionHost = {
      id: string;
      user: string;
      os: string;
      arch: string;
      cpu: number;
      memory: number;
      hostname: string;
      external_ip: string;
      internal_ip: string;
      ssh_port: number;
      status: number;
      instance_id: string;
      update_at: string;
};

type ClusterLogsRequest = {
      cluster_id: string;
      tail_lines: number;
      cluster_name: string;
      current_line: number;
}

type ClusterLogsResponse = {
      logs: string;
      last_line: number;
}


type Project = {
      id: string;
      name: string;
      description: string;
      cluster_id: string;
      state: string;
      business: Business[];
      business_technology: string;
};

type Business = {
      name: string;
      technologys: Technology[];
};

type Technology = {
      name: string;
};

type Service = {
      id: string;
      name: string;
      code_repo: string;
      replicas: number;
      cpu: number;
      limit_cpu: number;
      gpu: number;
      limit_gpu: number;
      memory: number;
      limit_memory: number;
      disk: number;
      limit_disk: number;
      workflow_id: string;
      ports: Port[];
      project_id: string;
      business: string;
      technology: string;
      project_name: string;
};

type Port = {
      id: string;
      ingress_path: string;
      container_port: number;
      protocol: string;
};

type Ci = {
      id: string;
      version: string;
      branch: string;
      tag: string;
      args: string;
      state: string;
      description: string;
      workflow_name: string;
      service_id: string;
      created_at: string;
      username: string;
      user_id: string;
      logs: string;
};

type Cd = {
      id: string;
      service_id: string;
};

type BreadCrumb = {
      path: string;
      title: string;
};

type Worklfow = {
      id: string;
      name: string;
      description: string;
      steps: wfStep[];
      templates: wfTemplate[];
}

type WfStep = {
      name: string;
      tasks: wfTask[];
      default: boolean;
      previous_step: string;
}

type WfTask = {
      name: string;
      template_name: string;
      default: boolean;
}

type WfTemplate = {
      name: string;
      image: string;
      command: string[];
      args: string[];
      source: string;
      is_script: boolean;
      previous_task: string;
}

