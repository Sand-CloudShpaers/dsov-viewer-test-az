<?xml version="1.0"?>

<xsl:stylesheet version="3.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:se="http://www.opengis.net/se"
                xmlns:math="http://www.w3.org/2005/xpath-functions/math"
                exclude-result-prefixes="se math">
    <xsl:strip-space elements="*"/>

    <xsl:variable name="targetDir" select="'./src/assets/symbolen/symbols/punt'"/>

    <xsl:template match="/">
        <xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="@*|node()">
        <xsl:apply-templates select="@*|node()"/>
    </xsl:template>

    <xsl:template match="se:Rule/se:PointSymbolizer">
        <xsl:result-document href="{$targetDir}/{se:Name}.svg">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
                <xsl:variable name="size" select="se:Graphic/se:Size"/>
                <xsl:attribute name="height">
                    <xsl:value-of select="$size"/>
                </xsl:attribute>
                <xsl:attribute name="width">
                    <xsl:value-of select="$size"/>
                </xsl:attribute>
                <xsl:if test="se:Graphic/se:Mark/se:WellKnownName='cross_fill'">
                    <xsl:variable name="viewbox">
                        0<xsl:text> </xsl:text>
                        0<xsl:text> </xsl:text>
                        <xsl:value-of select="se:Graphic/se:Size"/><xsl:text> </xsl:text>
                        <xsl:value-of select="se:Graphic/se:Size"/>
                    </xsl:variable>
                    <xsl:attribute name="viewbox">
                        <xsl:value-of select="normalize-space(translate($viewbox,'&#10;', ''))"/>
                    </xsl:attribute>
                </xsl:if>
                <xsl:if test="se:Graphic/se:Mark/se:WellKnownName='star' or se:Graphic/se:Mark/se:WellKnownName='triangle'">
                    <xsl:variable name="viewbox">
                        0<xsl:text> </xsl:text>
                        0<xsl:text> </xsl:text>
                        24<xsl:text> </xsl:text>
                        24
                    </xsl:variable>
                    <xsl:attribute name="viewbox">
                        <xsl:value-of select="normalize-space(translate($viewbox,'&#10;', ''))"/>
                    </xsl:attribute>
                </xsl:if>
                <xsl:apply-templates select="se:Graphic"/>
            </svg>
        </xsl:result-document>
    </xsl:template>

    <xsl:template match="se:Graphic">
        <xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="se:Mark[se:WellKnownName='circle']">
        <!-- Punt Cirkel 24 (pc0) / 16 (pc1) / 12 (pc2) -->
        <circle xmlns="http://www.w3.org/2000/svg">
            <xsl:variable name="size" select="../se:Size div 2"/>
            <xsl:attribute name="cx">
                <xsl:value-of select="$size"/>
            </xsl:attribute>
            <xsl:attribute name="cy">
                <xsl:value-of select="$size"/>
            </xsl:attribute>
            <xsl:attribute name="r">
                <xsl:value-of select="$size"/>
            </xsl:attribute>
            <xsl:call-template name="style"/>
        </circle>
    </xsl:template>

    <xsl:template match="se:Mark[se:WellKnownName='cross_fill']">
        <!-- Punt Kruis 24 (pk0) / 16 (pk1) / 12 (pk2) -->
        <!-- Punt X 24 (px0) / 16 (px1) / 12 (px2) [X is een Kruis met se:Rotation 45] -->
        <polygon xmlns="http://www.w3.org/2000/svg">
            <xsl:attribute name="points">
                <xsl:choose>
                    <xsl:when test="../se:Size='24'">
                        <xsl:value-of select="'10,0 14,0 14,10 24,10 24,14 14,14 14,24 10,24 10,14 0,14 0,10 10,10 10,0'"/>
                    </xsl:when>
                    <xsl:when test="../se:Size='16'">
                        <xsl:value-of select="'6.667,0 9.333,0 9.333,6.667 16,6.667 16,9.333 9.333,9.333 9.333,16 6.667,16 6.667,9.333 0,9.333 0,6.667 6.667,6.667 6.667,0'"/>
                    </xsl:when>
                    <xsl:when test="../se:Size='12'">
                        <xsl:value-of select="'5,0 7,0 7,5 12,5 12,7 7,7 7,12 5,12 5,7 0,7 0,5 5,5 5,0'"/>
                    </xsl:when>
                </xsl:choose>
            </xsl:attribute>
            <xsl:call-template name="style"/>
        </polygon>
    </xsl:template>


    <xsl:template match="se:Mark[se:WellKnownName='triangle']">
        <!-- Punt Driehoek 24 (pd0) / 16 (pd1) / 12 (pd2) -->
        <polygon xmlns="http://www.w3.org/2000/svg">
            <xsl:variable name="fullSize" select="../se:Size"/>
            <xsl:variable name="halfSize" select="../se:Size div 2"/>
            <xsl:attribute name="points">
                <xsl:value-of select="concat($halfSize, ',0 ',$fullSize,',',$fullSize,' 0,',$fullSize,' ',$halfSize,',0')"/>
            </xsl:attribute>
            <xsl:call-template name="style"/>
        </polygon>
    </xsl:template>

    <xsl:template match="se:Mark[se:WellKnownName='square']">
        <!-- Punt Vierkant 24 (pv0) / 16 (pv1) / 12 (pv2) -->
        <!-- Punt Ruit 24 (pr0) / 16 (pr1) / 12 (pr2) [Ruit is een Vierkant met se:Rotation 45]-->
        <!-- Een ruit is een vierkant 45 graden geroteerd: de diagonaal wordt "geforceerd" tot de se:Size -->
        <xsl:variable name="size">
            <xsl:choose>
                <xsl:when test="../se:Rotation='45'">
                    <xsl:variable name="trueDiagonalSize" select="math:sqrt(2 * math:pow(../se:Size, 2))"/>
                    <xsl:value-of select="../se:Size * (../se:Size div $trueDiagonalSize)"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="../se:Size"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <rect xmlns="http://www.w3.org/2000/svg">
            <xsl:attribute name="height">
                <xsl:value-of select="$size"/>
            </xsl:attribute>
            <xsl:attribute name="width">
                <xsl:value-of select="$size"/>
            </xsl:attribute>
            <xsl:if test="../se:Rotation='45'">
                <xsl:variable name="translation">
                    <xsl:value-of select="math:sqrt(2 * math:pow(($size div 2), 2)) - ($size div 2)"/>
                </xsl:variable>
                <xsl:attribute name="x">
                    <xsl:value-of select="$translation"/>
                </xsl:attribute>
                <xsl:attribute name="y">
                    <xsl:value-of select="$translation"/>
                </xsl:attribute>
            </xsl:if>
            <xsl:call-template name="style"/>
        </rect>
    </xsl:template>

    <xsl:template match="se:Mark[se:WellKnownName='star']">
        <!-- Punt Ster 24 (ps0) / 16 (ps1) / 12 (ps2) -->
        <polygon xmlns="http://www.w3.org/2000/svg">
            <xsl:variable name="scaleFactor" select="../se:Size div 24"/> <!-- 24 = 1, 16 = 2/3, 12 = 1/2 -->
            <xsl:attribute name="points">
                <xsl:value-of select="concat($scaleFactor*12, ',0 ', $scaleFactor*19, ',', $scaleFactor*21, ' ', $scaleFactor, ',', $scaleFactor*8, ' ', $scaleFactor*23, ',', $scaleFactor*8, ' ', $scaleFactor*5, ',', $scaleFactor*21, ' ', $scaleFactor*12, ',0')"/>
            </xsl:attribute>
            <xsl:call-template name="style"/>
        </polygon>
    </xsl:template>
    
    <xsl:template name="style">
        <xsl:variable name="output">
            <xsl:apply-templates select="se:Fill"/>
            <xsl:apply-templates select="se:Stroke"/>
            <xsl:apply-templates select="../se:Rotation" mode="style"/>
        </xsl:variable>
        <xsl:attribute name="style">
            <xsl:value-of select="normalize-space(translate($output,'&#10;', ' '))"/>
        </xsl:attribute>
    </xsl:template>

    <xsl:template match="se:Rotation" mode="style">
        transform-origin: center;transform: rotate(<xsl:value-of select="."/>deg);
    </xsl:template>

    <xsl:template match="se:Fill">
        <xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="se:Stroke">
        <xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="se:SvgParameter">
        <xsl:value-of select="@name"/>:<xsl:value-of select="."/>;
    </xsl:template>

</xsl:stylesheet>
