type QueryParams = {
  entityType?: string;
  field?: string;
  values?: string[];
};

type EntityDTO = {
  // Entity as it should be returned to client
  id?: string;
  displayName?: string;
  hierarchy?: string;
  directGroup?: string;
  entityType?: string; // enum
  identityCard?: string;
  personalNumber?: string;
  goalUserId?: string;
  serviceType?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  akaUnit?: string;
  dischargeDate?: Date;
  rank?: string; // enum
  mail?: string;
  jobTitle?: string;
  phone?: string[];
  mobilePhone?: string[];
  address?: string;
  clearance?: string; // string of number - enum
  sex?: string;
  birthDate?: string;
  createdAt?: string;
  updatedAt?: string;
  pictures?: {
    profile?: {
      url: string;
      meta: ProfilePictureData;
    };
  };
  digitalIdentities?: DigitalIdentityDTO[];
};

type DigitalIdentityDTO = {
  // DI as it should be returned to client
  type?: string;
  source?: string;
  mail?: string;
  uniqueId?: string;
  entityId?: string;
  createdAt?: string;
  updatedAt?: string;
  isRoleAttachable?: boolean;
  role?: RoleDTO;
};

type RoleDTO = {
  // role as it should be returned to client
  roleId: string;
  jobTitle: string;
  digitalIndentityUniqueId: string;
  directGroup: string;
  clearance: string;
  hierarchy: string;
  hierarchyIds: string[];
  createdAt: string;
  updatedAt: string;
  source: string;
};

type ProfilePictureData = {
  path: string;
  format: string;
  updatedAt?: string;
  createdAt: string;
};

type typesOfEntities = 'entity' | 'digitalIdentity' | 'role' | 'group';

export { ProfilePictureData, RoleDTO, EntityDTO, QueryParams, DigitalIdentityDTO, typesOfEntities };
