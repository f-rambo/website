import React, { ReactNode } from 'react';

type ChildContainerProps = {
      children: ReactNode;
};

type User = {
      id: string;
      username: string;
      email: string;
      access_token: string;
      state: string;
      updated_at: string;
      sign_type: string;
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

type Cluster = {
      id: string;
      name: string;
      cloud_id: string;
      connections: string;
      certificate_authority: string;
      version: string;
      api_server_address: string;
      config: string;
      addons: string;
      addons_config: string;
      status: string;
      type: string;
      kube_config: string;
      key_pair: string;
      public_key: string;
      private_key: string;
      region: string;
      vpc_id: string;
      vpc_cidr: string;
      eip_id: string;
      nat_gateway_id: string;
      resource_group_id: string;
      security_group_ids: string;
      external_ip: string;
      access_id: string;
      access_key: string;
      load_balancer_id: string;
      nodes: Node[];
      node_groups: NodeGroup[];
      bostion_host: BostionHost;
};

type NodeGroup = {
      id: string;
      name: string;
      cloud_nodegroup_id: string;
      type: string;
      instance_type: string;
      image: string;
      os: string;
      arch: string;
      cpu: number;
      memory: number;
      gpu: number;
      node_init_script: string;
      min_size: number;
      max_size: number;
      target_size: number;
      system_disk: number;
      data_disk: number;
      cluster_id: number;
};

type Node = {
      id: string;
      instance_id: string;
      name: string;
      labels: string;
      annotations: string;
      os_image: string;
      kernel: string;
      container: string;
      kubelet: string;
      kube_proxy: string;
      ssh_port: number;
      internal_ip: string;
      external_ip: string;
      user: string;
      role: string;
      status: string;
      error_info: string;
      zone: string;
      subnet_id: string;
      subnet_cidr: string;
      public_key: string;
      gpu_spec: string;
      system_disk: number;
      data_disk: number;
      node_price: number;
      pod_price: number;
      internet_max_bandwidth_out: number;
      cluster_id: number;
      node_group_id: string;
};

type BostionHost = {
      id: string;
      instance_type: string;
      instance_id: string;
      user: string;
      image_id: string;
      image: string;
      os: string;
      arch: string;
      hostname: string;
      external_ip: string;
      internal_ip: string;
      ssh_port: number;
      private_ip: string;
      cluster_id: number;
      cpu: number;
      memory: number;
};



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

