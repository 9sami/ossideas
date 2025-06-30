# Supabase Row Level Security (RLS) Policies

This document summarizes the RLS (Row Level Security) policies for each table in the OSSIdeas database. Each table lists its policies, the permitted operations, and the access conditions or roles.

---

## Table: `profiles`

| Policy Name                  | Operation(s) | Condition / Role |
| ---------------------------- | ------------ | ---------------- |
| Users can view own profile   | SELECT       | auth.uid() = id  |
| Users can update own profile | UPDATE       | auth.uid() = id  |
| Users can insert own profile | INSERT       | auth.uid() = id  |

## Table: `repositories`

| Policy Name                    | Operation(s) | Condition / Role             |
| ------------------------------ | ------------ | ---------------------------- |
| System can manage repositories | ALL          | auth.role() = 'service_role' |

## Table: `ideas`

| Policy Name                        | Operation(s) | Condition / Role             |
| ---------------------------------- | ------------ | ---------------------------- |
| All users can read published ideas | SELECT       | status = 'published'         |
| System can manage ideas            | ALL          | auth.role() = 'service_role' |

## Table: `analysis_results`

| Policy Name                                             | Operation(s) | Condition / Role                 |
| ------------------------------------------------------- | ------------ | -------------------------------- |
| All users can read analysis results for published ideas | SELECT       | Linked idea status = 'published' |
| Curators can update their results                       | UPDATE       | curated_by_user_id = auth.uid()  |
| System can manage analysis results                      | ALL          | auth.role() = 'service_role'     |

## Table: `errors`

| Policy Name              | Operation(s) | Condition / Role             |
| ------------------------ | ------------ | ---------------------------- |
| System can manage errors | ALL          | auth.role() = 'service_role' |

## Table: `user_saved_ideas`

| Policy Name                      | Operation(s) | Condition / Role     |
| -------------------------------- | ------------ | -------------------- |
| Users can manage own saved ideas | ALL          | user_id = auth.uid() |

## Table: `user_liked_ideas`

| Policy Name                      | Operation(s) | Condition / Role     |
| -------------------------------- | ------------ | -------------------- |
| Users can manage own liked ideas | ALL          | user_id = auth.uid() |

## Table: `subscriptions`

| Policy Name                     | Operation(s) | Condition / Role             |
| ------------------------------- | ------------ | ---------------------------- |
| Users can view own subscription | SELECT       | user_id = auth.uid()         |
| System can manage subscriptions | ALL          | auth.role() = 'service_role' |

## Table: `submitted_repositories`

| Policy Name                                 | Operation(s) | Condition / Role     |
| ------------------------------------------- | ------------ | -------------------- |
| Users can read own submitted repositories   | SELECT       | user_id = auth.uid() |
| Users can manage own submitted repositories | ALL          | user_id = auth.uid() |

## Table: `categories`

| Policy Name                      | Operation(s) | Condition / Role             |
| -------------------------------- | ------------ | ---------------------------- |
| Public read access to categories | SELECT       | Public (any request)         |
| System can manage categories     | ALL          | auth.role() = 'service_role' |

## Table: `languages`

| Policy Name                     | Operation(s) | Condition / Role             |
| ------------------------------- | ------------ | ---------------------------- |
| Public read access to languages | SELECT       | Public (any request)         |
| System can manage languages     | ALL          | auth.role() = 'service_role' |

## Table: `industries`

| Policy Name                      | Operation(s) | Condition / Role             |
| -------------------------------- | ------------ | ---------------------------- |
| Public read access to industries | SELECT       | Public (any request)         |
| System can manage industries     | ALL          | auth.role() = 'service_role' |

## Table: `analysis_types`

| Policy Name                      | Operation(s) | Condition / Role             |
| -------------------------------- | ------------ | ---------------------------- |
| System can manage analysis types | ALL          | auth.role() = 'service_role' |

## Table: `repository_categories`

| Policy Name                                 | Operation(s) | Condition / Role             |
| ------------------------------------------- | ------------ | ---------------------------- |
| Public read access to repository categories | SELECT       | Public (any request)         |
| System can manage repository categories     | ALL          | auth.role() = 'service_role' |

## Table: `repository_languages`

| Policy Name                                | Operation(s) | Condition / Role             |
| ------------------------------------------ | ------------ | ---------------------------- |
| Public read access to repository languages | SELECT       | Public (any request)         |
| System can manage repository languages     | ALL          | auth.role() = 'service_role' |

## Table: `user_categories`

| Policy Name                               | Operation(s) | Condition / Role     |
| ----------------------------------------- | ------------ | -------------------- |
| Users can manage own category preferences | ALL          | user_id = auth.uid() |

## Table: `user_preferred_languages`

| Policy Name                               | Operation(s) | Condition / Role     |
| ----------------------------------------- | ------------ | -------------------- |
| Users can manage own language preferences | ALL          | user_id = auth.uid() |

## Table: `user_industries`

| Policy Name                               | Operation(s) | Condition / Role     |
| ----------------------------------------- | ------------ | -------------------- |
| Users can manage own industry preferences | ALL          | user_id = auth.uid() |

## Table: `digest_ideas`

| Policy Name                    | Operation(s) | Condition / Role             |
| ------------------------------ | ------------ | ---------------------------- |
| System can manage digest ideas | ALL          | auth.role() = 'service_role' |
