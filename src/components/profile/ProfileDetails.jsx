import {EditContainer, HorizontalContainer, VerticalContainer} from "../../tamagui.config.ts";
import {H2, H4, Separator, SizableText} from "tamagui";

const ProfileDetails = (props) => {
    return (
            <VerticalContainer>
                <H2>Profile details</H2>
                <HorizontalContainer
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <H4>Username</H4>
                    <SizableText>{props.user.name}</SizableText>
                </HorizontalContainer>
                <Separator />
                <HorizontalContainer
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <H4>Email</H4>
                    <SizableText>{props.user.email}</SizableText>
                </HorizontalContainer>
                {props.store && <>
                    <Separator />
                    <VerticalContainer>
                        <H4>Privileges</H4>
                        {!props.user.is_admin && !props.user.is_buyer && !props.user.is_seller && <SizableText>None</SizableText>}
                        <SizableText>{props.user.is_admin ? 'Admin' : ''}</SizableText>
                        <SizableText>{props.user.is_buyer ? 'Buyer' : ''}</SizableText>
                        <SizableText>{props.user.is_seller ? 'Seller' : ''}</SizableText>
                    </VerticalContainer>
                </>
                }
                <SizableText alignSelf="center">Register date: {props.user.created_at.slice(0,10)}</SizableText>
            </VerticalContainer>
    )
}

export default ProfileDetails;