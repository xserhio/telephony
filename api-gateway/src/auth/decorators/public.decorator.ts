import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const PublicDecorator = () => SetMetadata(IS_PUBLIC_KEY, true);
