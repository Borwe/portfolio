export class CoreLimit{
  limit!: number;
  remaining!: number;
  reset!: number;
  used!: number;
  resource!: string;
}

export class SearchLimit{
  limit!: number;
  remaining!: number;
  reset!: number;
  used!: number;
  resource!: string;
}

export class Resources{
  core!: CoreLimit;
  graphql!: CoreLimit;
  integration_manifest!: CoreLimit;
  search!: SearchLimit;
}

export class RateLimit{
  resources!:Resources;
  rate!:CoreLimit;
}
