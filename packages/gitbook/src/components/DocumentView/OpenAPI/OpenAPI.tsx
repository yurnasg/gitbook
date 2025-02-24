import { DocumentBlockOpenAPI } from '@gitbook/api';
import { Icon } from '@gitbook/icons';
import { OpenAPIOperation } from '@gitbook/react-openapi';
import React from 'react';

import { LoadingPane } from '@/components/primitives';
import { fetchOpenAPIBlock } from '@/lib/openapi';
import { tcls } from '@/lib/tailwind';

import { BlockProps } from '../Block';
import { PlainCodeBlock } from '../CodeBlock';

import './style.css';
import './scalar.css';

/**
 * Render an OpenAPI block.
 */
export async function OpenAPI(props: BlockProps<DocumentBlockOpenAPI>) {
    const { style } = props;
    return (
        <div className={tcls('w-full', 'flex', 'flex-row', style, 'max-w-full')}>
            <OpenAPIBody {...props} />
        </div>
    );
}

async function OpenAPIBody(props: BlockProps<DocumentBlockOpenAPI>) {
    const { block, context } = props;
    const { data, specUrl, error } = await fetchOpenAPIBlock(block, context.resolveContentRef);

    if (error) {
        return (
            <div className={tcls('hidden')}>
                <p>
                    Error with {error.rootURL}: {error.message}
                </p>
            </div>
        );
    }

    if (!data || !specUrl) {
        return null;
    }

    return (
        <OpenAPIOperation
            data={data}
            context={{
                specUrl,
                icons: {
                    chevronDown: <Icon icon="chevron-down" />,
                    chevronRight: <Icon icon="chevron-right" />,
                    plus: <Icon icon="plus" />,
                },
                CodeBlock: PlainCodeBlock,
                defaultInteractiveOpened: context.mode === 'print',
                id: block.meta?.id,
                blockKey: block.key,
            }}
            className="openapi-block"
        />
    );
}

function OpenAPIFallback() {
    return (
        <div
            role="status"
            aria-busy
            className={'openapi-block ' + tcls('flex', 'flex-1', 'flex-col', 'gap-3')}
        >
            <LoadingPane
                tile={12}
                style={['rounded-md', 'h-[47px]', '[max-width:calc(48rem-1px)]']}
            />
            <LoadingPane
                tile={12}
                style={['rounded-md', 'h-[35px]', '[max-width:calc(48rem-1px)]']}
            />
            <div className={tcls('flex', 'gap-[25px]')}>
                <div className={tcls('flex', 'flex-1', 'flex-col', 'gap-3')}>
                    <LoadingPane tile={24} style={['rounded-md', 'aspect-[2.5/1]', 'w-full']} />
                    <LoadingPane tile={24} style={['rounded-md', 'aspect-[2.5/1]', 'w-full']} />
                </div>
                <div className={tcls('flex', 'flex-1', 'flex-col', 'gap-3')}>
                    <LoadingPane tile={24} style={['rounded-md', 'aspect-[4/1]', 'w-full']} />
                    <LoadingPane tile={24} style={['rounded-md', 'aspect-[4/1]', 'w-full']} />
                </div>
            </div>
        </div>
    );
}
