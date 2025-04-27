import {HorizontalContainer, ProfileContainer, VerticalContainer} from "../../tamagui.config.ts";
import {H2, H4, Separator, SizableText} from "tamagui";
import React from "react";
import PropTypes from "prop-types";

const ProfileDetails = ({user, store}) => {
    return (
            <VerticalContainer>
                <H2>Profile details</H2>
                <ProfileContainer>
                    <HorizontalContainer
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <H4>Username</H4>
                        <SizableText>{user?.name}</SizableText>
                    </HorizontalContainer>
                    <Separator />
                    <HorizontalContainer
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <H4>Email</H4>
                        <SizableText>{user?.email}</SizableText>
                    </HorizontalContainer>
                    {store && <>
                        <Separator />
                        <VerticalContainer>
                            <H4>Privileges</H4>
                            {!user.is_admin && !user.is_buyer && !user.is_seller && <SizableText>None</SizableText>}
                            <SizableText>{user.is_admin ? 'Admin' : ''}</SizableText>
                            <SizableText>{user.is_buyer ? 'Buyer' : ''}</SizableText>
                            <SizableText>{user.is_seller ? 'Seller' : ''}</SizableText>
                        </VerticalContainer>
                    </>
                    }
                    <SizableText alignSelf="center">Register date: {user?.created_at.slice(0,10)}</SizableText>
                </ProfileContainer>
            </VerticalContainer>
    )
}

ProfileDetails.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
        created_at: PropTypes.string,
        is_admin: PropTypes.number,
        is_buyer: PropTypes.number,
        is_seller: PropTypes.number
    }),
    store: PropTypes.object
}

export default React.memo(ProfileDetails);