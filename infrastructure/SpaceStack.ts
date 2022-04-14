import {Stack, StackProps} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Code, Runtime, Function as LambdaFuntion } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { GenerateTable } from './GenericTable';

export class SpaceStack extends Stack{
    private api = new RestApi(this, 'SpaceApi');
    private spacesTable = new GenerateTable(
        'SpacesTable',
        'spaceId',
        this
    );

    constructor(scope: Construct,id: string, props: StackProps){
        super(scope,id,props);

        const bismillahLambda = new LambdaFuntion(this, 'BismillahLambda',{
            runtime: Runtime.NODEJS_14_X,
            code: Code.fromAsset(join(__dirname,'..','services','bismillah')),
            handler: 'bismillah.main'
        });

        // Bismillah Lambda Integration:
        const bismillahLambdaIntegration = new LambdaIntegration(bismillahLambda);
        const bismillahLambdaResource = this.api.root.addResource('bismillah');
        bismillahLambdaResource.addMethod('GET', bismillahLambdaIntegration);
    }
}