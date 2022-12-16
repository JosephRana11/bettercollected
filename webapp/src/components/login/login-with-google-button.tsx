import { Google } from '@app/components/icons/brands/google';
import environments from '@app/configs/environments';

interface ConnectWithGoogleButtonProps {
    text: string;
    creator?: boolean;
}

ConnectWithGoogleButton.defaultProps = {
    creator: false
};

export default function ConnectWithGoogleButton(props: ConnectWithGoogleButtonProps) {
    const { text, creator } = props;

    return (
        <a href={`${environments.API_ENDPOINT_HOST}/auth/google/basicAuth${creator ? '?creator=true' : ''}`} referrerPolicy="unsafe-url" className="bg-[#1a73e8] max-w-[250px] mx-auto flex w-full items-center rounded-2xl p-[2px]">
            <div className=" rounded-full bg-white p-2">
                <Google />
            </div>
            <div className="flex items-center w-full justify-center font-bold text-white text-[12px]">{text}</div>
        </a>
    );
}
