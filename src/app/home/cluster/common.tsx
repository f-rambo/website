"use client";
import {
  ClusterType,
  ClusterStatus,
  ClusterLevel,
  NodeStatus,
  NodeGroupType,
  NodeRole,
  ResourceType,
} from "@/types/types";
import { ClusterServices } from "@/services/cluster/v1alpha1/cluster";

let clusterTypes: ClusterType[] = [];
let clusterStatuses: ClusterStatus[] = [];
let clusterLevel: ClusterLevel[] = [];
let nodeStatuses: NodeStatus[] = [];
let nodeGroupTypes: NodeGroupType[] = [];
let nodeRoles: NodeRole[] = [];
let resourceType: ResourceType[] = [];

const getClusterTypes = () => {
  if (clusterTypes.length > 0) {
    return;
  }
  ClusterServices.getClusterTypes().then((res) => {
    if (res instanceof Error) {
      return;
    }
    clusterTypes = res.cluster_types as ClusterType[];
  });
};

// GetClusterStatuses
const getClusterStatuses = () => {
  if (clusterStatuses.length > 0) {
    return;
  }
  ClusterServices.getClusterStatuses().then((res) => {
    if (res instanceof Error) {
      return;
    }
    clusterStatuses = res.cluster_statuses as ClusterStatus[];
  });
};

// GetClusterLevels
const getClusterLevels = () => {
  if (clusterLevel.length > 0) {
    return;
  }
  ClusterServices.getClusterLevels().then((res) => {
    if (res instanceof Error) {
      return;
    }
    clusterLevel = res.cluster_levels as ClusterLevel[];
  });
};

// GetNodeRoles
const getNodeRoles = () => {
  if (nodeRoles.length > 0) {
    return;
  }
  ClusterServices.getNodeRoles().then((res) => {
    if (res instanceof Error) {
      return;
    }
    nodeRoles = res.node_roles as NodeRole[];
  });
};

// GetNodeStatuses
const getNodeStatuses = () => {
  if (nodeStatuses.length > 0) {
    return;
  }
  ClusterServices.getNodeStatuses().then((res) => {
    if (res instanceof Error) {
      return;
    }
    nodeStatuses = res.node_statuses as NodeStatus[];
  });
};

// GetNodeGroupTypes
const getNodeGroupTypes = () => {
  if (nodeGroupTypes.length > 0) {
    return;
  }
  ClusterServices.getNodeGroupTypes().then((res) => {
    if (res instanceof Error) {
      return;
    }
    nodeGroupTypes = res.node_group_types as NodeGroupType[];
  });
};

// GetResourceTypes
const getResourceTypes = () => {
  if (resourceType.length > 0) {
    return;
  }
  ClusterServices.getResourceTypes().then((res) => {
    if (res instanceof Error) {
      return;
    }
    resourceType = res.resource_types as ResourceType[];
  });
};

export const initializeData = () => {
  getClusterTypes();
  getClusterStatuses();
  getClusterLevels();
  getNodeRoles();
  getNodeStatuses();
  getNodeGroupTypes();
  getResourceTypes();
};

export const isClusterCloudType = (type: number) => {
  const clusterType = clusterTypes.find((clusterType) => {
    return clusterType.id === type;
  });
  return clusterType?.is_cloud;
};

export const getClusterAllTypes = () => {
  return clusterTypes;
};

export const findClusterTypeByName = (name: string) => {
  const clusterType = clusterTypes.find((clusterType) => {
    return clusterType.name === name;
  });
  return clusterType?.id;
};

export const findClusterTypeById = (id: number) => {
  if (id === 0) {
    return "Unknown";
  }
  const clusterType = clusterTypes.find((clusterType) => {
    return clusterType.id === id;
  });
  return clusterType?.name;
};

export const findClusterStatusById = (id: number) => {
  if (id === 0) {
    return "Unknown";
  }
  const clusterStatus = clusterStatuses.find((clusterStatus) => {
    return clusterStatus.id === id;
  });
  return clusterStatus?.name;
};

// find clusete node group type by id
export const findNodeGroupTypeById = (id: number) => {
  if (id === 0) {
    return "Unknown";
  }
  const nodeGroupType = nodeGroupTypes.find((nodeGroupType) => {
    return nodeGroupType.id === id;
  });
  return nodeGroupType?.name;
};

// find node status by id
export const findNodeStatusById = (id: number) => {
  if (id === 0) {
    return "Unknown";
  }
  const nodeStatus = nodeStatuses.find((nodeStatus) => {
    return nodeStatus.id === id;
  });
  return nodeStatus?.name;
};

// find node role by id
export const findNodeRoleById = (id: number) => {
  if (id === 0) {
    return "Unknown";
  }
  const nodeRole = nodeRoles.find((nodeRole) => {
    return nodeRole.id === id;
  });
  return nodeRole?.name;
};
