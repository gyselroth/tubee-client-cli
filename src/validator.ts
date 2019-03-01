import { Identifier as EndpointIdentifier } from './resources/endpoints';
import { Identifier as AccessRoleIdentifier } from './resources/access-roles';
import { Identifier as AccessRuleIdentifier } from './resources/access-rules';
import { Identifier as CollectionIdentifier } from './resources/collections';
import { Identifier as DataObjectIdentifier } from './resources/data-objects';
import { Identifier as RelationIdentifier } from './resources/relations';
import { Identifier as NamespaceIdentifier } from './resources/namespaces';
import { Identifier as JobIdentifier } from './resources/jobs';
import { Identifier as ProcessIdentifier } from './resources/processes';
import { Identifier as WorkflowIdentifier } from './resources/workflows';
import { Identifier as SecretIdentifier } from './resources/secrets';
import { Identifier as UserIdentifier } from './resources/users';
const lodash = require('lodash');

export const identifierMap = {
  Namespace: NamespaceIdentifier,
  Secret: SecretIdentifier,
  User: UserIdentifier,
  AccessRole: AccessRoleIdentifier,
  AccessRule: AccessRuleIdentifier,
  Collection: CollectionIdentifier,
  PdoEndpoint: EndpointIdentifier,
  MysqlEndpoint: EndpointIdentifier,
  MongodbEndpoint: EndpointIdentifier,
  CsvEndpoint: EndpointIdentifier,
  XmlEndpoint: EndpointIdentifier,
  JsonEndpoint: EndpointIdentifier,
  ImageEndpoint: EndpointIdentifier,
  LdapEndpoint: EndpointIdentifier,
  BalloonEndpoint: EndpointIdentifier,
  UcsEndpoint: EndpointIdentifier,
  OdataRestEndpoint: EndpointIdentifier,
  MoodleEndpoint: EndpointIdentifier,
  DataObject: DataObjectIdentifier,
  DataObjectRelation: RelationIdentifier,
  Workflow: WorkflowIdentifier,
  GarbageWorkflow: WorkflowIdentifier,
  Job: JobIdentifier,
  Process: ProcessIdentifier,
};

export const validate = function(resource) {
  if (!resource.kind || !identifierMap[resource.kind]) {
    return false;
  }

  let diff = lodash.pick(resource, identifierMap[resource.kind]);
  if (Object.keys(diff).length !== identifierMap[resource.kind].length) {
    return false;
  }

  return true;
};
