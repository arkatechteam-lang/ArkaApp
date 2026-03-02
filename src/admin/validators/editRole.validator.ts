import type { CreateRoleFormInput, RoleCategoryLabel } from './createRole.validator';
import { validateCreateRole } from './createRole.validator';

// Re-use the same shape as create; keep a named alias for clarity
export type EditRoleFormInput = CreateRoleFormInput;
export type { RoleCategoryLabel };

// Validation rules are identical for create and edit
export const validateEditRole = validateCreateRole;
