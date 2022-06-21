import { DigitalIdentityDTO, EntityDTO, RoleDTO, Transform } from "../types";
import { transformerMap } from "./transformers";

/**
 * 
 * @param userTransformers - to apply on entity result
 * @param entity entity result to fix by transformers
 * @returns fixed entity
 */
export const applyTransformers = (userTransformers: Transform[], entity: EntityDTO | RoleDTO | DigitalIdentityDTO) => {
  let entityCopy = { ...entity };

  userTransformers.forEach((transformer) => {
    entityCopy = transformerMap[transformer.method](entityCopy, transformer, entity);
  });

  return entityCopy;
}