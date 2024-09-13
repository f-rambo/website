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
      server_version: string;
      api_server_address: string;
      config: string;
      addons: string;
      addons_config: string;
      state: string;
      nodes: Node[];
      logs: string;
      is_current_cluster: boolean;
};

type Node = {
      id: string;
      name: string;
      labels: string;
      annotations: string;
      os_image: string;
      kernel: string;
      container: string;
      kubelet: string;
      kube_proxy: string;
      internal_ip: string;
      external_ip: string;
      user: string;
      password: string;
      sudo_password: string;
      role: string;
      state: string;
      cluster_id: number;
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

