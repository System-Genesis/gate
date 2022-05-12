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
  birthDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  pictures?: {
    profile?: {
      url?: string;
      meta?: ProfilePictureData;
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
  createdAt?: Date;
  updatedAt?: Date;
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
  createdAt: Date;
  updatedAt: Date;
  source: string;
};

type ProfilePictureData = {
  path: string;
  format: string;
  updatedAt?: Date;
  createdAt: Date;
};

type typesOfEntities = 'entity' | 'digitalIdentity' | 'role' | 'group';

export { ProfilePictureData, RoleDTO, EntityDTO, QueryParams, DigitalIdentityDTO, typesOfEntities };
