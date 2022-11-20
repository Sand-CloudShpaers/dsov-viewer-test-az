<?xml version="1.0"?>

<xsl:stylesheet version="3.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:se="http://www.opengis.net/se"
                xmlns:math="http://www.w3.org/2005/xpath-functions/math"
                exclude-result-prefixes="se math">
    <xsl:strip-space elements="*"/>

    <xsl:variable name="targetDir" select="'./src/assets/symbolen/symbols/lijn'"/>

    <xsl:template match="/">
        <xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="@*|node()">
        <xsl:apply-templates select="@*|node()"/>
    </xsl:template>

    <xsl:template match="se:Rule/se:LineSymbolizer">
        <xsl:result-document href="{$targetDir}/{se:Name}.svg">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" height="48" width="48">
                <line x1="0" x2="48" y1="24" y2="24">
                    <xsl:attribute name="style">
                        <xsl:variable name="output">
                            <xsl:apply-templates select="se:Stroke"/>
                        </xsl:variable>
                        <xsl:value-of select="normalize-space(translate($output,'&#10;', ' '))"/>
                    </xsl:attribute>
                </line>
            </svg>
        </xsl:result-document>
    </xsl:template>

    <xsl:template match="se:Stroke">
        <xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="se:SvgParameter">
        <xsl:value-of select="@name"/>:<xsl:value-of select="."/>;
    </xsl:template>

</xsl:stylesheet>
